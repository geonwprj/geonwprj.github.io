$(document).ready(async () => {
    const fromLat = parseFloat(getAllUrlParams().fmLat);
    const fromLong = parseFloat(getAllUrlParams().fmLong);
    const toLat = parseFloat(getAllUrlParams().toLat);
    const toLong = parseFloat(getAllUrlParams().toLong);
  
    console.log('loc: ', fromLat, fromLong, toLat, toLong);
    findRoutes(fromLat, fromLong, toLat, toLong).then(routes => {
        console.log('Found Routes:', routes);
        routes.map(v => {
            $("body").append(`<p>${v}</p>`);
          });
    });
  })

async function fetchData(type) {
    const baseUrl = 'https://data.etabus.gov.hk/v1/transport/kmb/';
    const url = type === 'stops' ? `${baseUrl}stop/` : `${baseUrl}route-stop/`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data; // Returns the relevant data array
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in km
}

function findNearbyStops(stops, fromLat, fromLong, toLat, toLong) {
    const nearbyFromStops = stops.filter(stop => 
        haversineDistance(fromLat, fromLong, stop.lat, stop.long) <= 1
    );

    const nearbyToStops = stops.filter(stop => 
        haversineDistance(toLat, toLong, stop.lat, stop.long) <= 1
    );

    return { nearbyFromStops, nearbyToStops };
}

async function findRoutes(fromLat, fromLong, toLat, toLong) {
    const stops = await fetchData('stops');
    const routeStops = await fetchData('route-stop');

    if (!stops || !routeStops) {
        console.error('Failed to fetch necessary data.');
        return [];
    }

    const { nearbyFromStops, nearbyToStops } = findNearbyStops(stops, fromLat, fromLong, toLat, toLong);
    console.log('Found stops:', nearbyFromStops, nearbyToStops);

    // Map for quick lookup of stop sequences
    const stopSeqMap = {};
    
    routeStops.forEach(route => {
        if (!stopSeqMap[route.route]) {
            stopSeqMap[route.route] = [];
        }
        stopSeqMap[route.route].push(route);
    });

    let results = [];
    console.log('Found routeStops:', routeStops);

    // Check each route for valid connections
    for (const route in stopSeqMap) {
        const stopsInRoute = stopSeqMap[route];
        
        for (const fromStop of nearbyFromStops) {
            for (const toStop of nearbyToStops) {
                // Ensure fromStop seq < toStop seq
                if (stopsInRoute.findIndex(s => s.stop === fromStop.stop) < 
                    stopsInRoute.findIndex(s => s.stop === toStop.stop)) {
                    
                    results.push({ route, fromStop, toStop });
                }
            }
        }
    }
    console.log('Found results:', results);

    // Sort results by distance and limit to 30 records
    results.sort((a, b) => {
        const distA = haversineDistance(fromLat, fromLong, a.fromStop.lat, a.fromStop.long) + 
                       haversineDistance(toLat, toLong, a.toStop.lat, a.toStop.long);
        const distB = haversineDistance(fromLat, fromLong, b.fromStop.lat, b.fromStop.long) + 
                       haversineDistance(toLat, toLong, b.toStop.lat, b.toStop.long);
        return distA - distB;
    });

    return results.slice(0, 30); // Return at most 30 records
}