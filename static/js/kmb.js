// jQuery document ready function
$(document).ready(async () => {
    const fromLat = parseFloat(getAllUrlParams().fmlat);
    const fromLong = parseFloat(getAllUrlParams().fmlong);
    const toLat = parseFloat(getAllUrlParams().tolat);
    const toLong = parseFloat(getAllUrlParams().tolong);

    console.log('loc: ', fromLat, fromLong, toLat, toLong);

    $('body').append('<div id="results"></div>');
    
    findRoutes(fromLat, fromLong, toLat, toLong).then(routes => {
        console.log('Found Routes:', routes);

        routes.forEach(v => {
            $("#results").append(`
                <div class="route">
                    <h3>Route: ${v.route}</h3>
                    <div class="stop">From Stop: ${v.fromStop.name_tc} (Distance: ${v.fromStop.distance.toFixed(2)} km)</div>
                    <div class="stop">To Stop: ${v.toStop.name_tc} (Distance: ${v.toStop.distance.toFixed(2)} km)</div>
                </div>
            `);
        });
        
        if (routes.length === 0) {
            $("#results").append("<p>No routes found.</p>");
        }
    });
});

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
    const nearbyFromStops = stops
        .map(stop => {
            const distance = haversineDistance(fromLat, fromLong, stop.lat, stop.long);
            return { ...stop, distance }; // Include distance in the returned object
        })
        .filter(stop => stop.distance <= 1); // Filter within 1 km

    const nearbyToStops = stops
        .map(stop => {
            const distance = haversineDistance(toLat, toLong, stop.lat, stop.long);
            return { ...stop, distance }; // Include distance in the returned object
        })
        .filter(stop => stop.distance <= 1); // Filter within 1 km

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

    // Map for quick lookup of stop sequences
    const stopSeqMap = {};
    
    routeStops.forEach(route => {
        if (!stopSeqMap[route.route]) {
            stopSeqMap[route.route] = [];
        }
        stopSeqMap[route.route].push(route);
    });

    let results = [];

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

