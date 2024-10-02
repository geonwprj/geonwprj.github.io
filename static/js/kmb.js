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

    // Debugging output for nearby stops
    console.log('Found stops: ', nearbyFromStops, nearbyToStops);

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

        // Create a mapping of stop IDs to their sequence numbers for easy access
        const seqMap = {};
        stopsInRoute.forEach((s) => {
            seqMap[s.stop] = s.seq;
        });

        let closestFromStop = null;
        let closestToStop = null;

        // Find the closest fromStop and toStop within the route
        if (nearbyFromStops.length > 0 && nearbyToStops.length > 0) {
            closestFromStop = nearbyFromStops.reduce((prev, curr) =>
                prev.distance < curr.distance ? prev : curr
            );

            closestToStop = nearbyToStops.reduce((prev, curr) =>
                prev.distance < curr.distance ? prev : curr
            );

            // Ensure both stops exist in the route and that fromStop seq < toStop seq
            if (
                seqMap[closestFromStop.stop] < seqMap[closestToStop.stop] &&
                seqMap[closestFromStop.stop] !== undefined &&
                seqMap[closestToStop.stop] !== undefined
            ) {
                results.push({
                    route,
                    bound: stopsInRoute[0].bound,
                    serviceType: stopsInRoute[0].service_type,
                    fromStop: closestFromStop,
                    toStop: closestToStop,
                });
            }
        }
    }

    // Sort results by route, bound, service type and total distance (from + to)
    results.sort((a, b) => {
        const distA =
            a.fromStop.distance + a.toStop.distance;
        const distB =
            b.fromStop.distance + b.toStop.distance;

        if (a.route !== b.route) return a.route.localeCompare(b.route);
        if (a.bound !== b.bound) return a.bound.localeCompare(b.bound);
        if (a.serviceType !== b.serviceType) return a.serviceType.localeCompare(b.serviceType);
        
        return distA - distB; // Sort by total distance last
    });

    console.log('Found Routes:', results); // Log all results

    return results.slice(0, 30); // Return at most 30 records for display
}

// jQuery document ready function
$(document).ready(async () => {
    const fromLat = parseFloat(getAllUrlParams().fmlat);
    const fromLong = parseFloat(getAllUrlParams().fmlong);
    const toLat = parseFloat(getAllUrlParams().tolat);
    const toLong = parseFloat(getAllUrlParams().tolong);

    console.log('loc: ', fromLat, fromLong, toLat, toLong);

    $('body').append('<div id="results"></div>');
    
    findRoutes(fromLat, fromLong, toLat, toLong).then(routes => {

        routes.forEach(v => {
            $("#results").append(`
                <div class="route">
                    <h3>Route: ${v.route}</h3>
                    <p>Bound: ${v.bound}</p>
                    <p>Service Type: ${v.serviceType}</p>
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