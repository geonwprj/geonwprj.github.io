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

        let validPairs = []; // Store valid pairs for each route

        for (const fromStop of nearbyFromStops) {
            for (const toStop of nearbyToStops) {
                // Ensure fromStop seq < toStop seq and both stops exist in the route
                if (
                    seqMap[fromStop.stop] < seqMap[toStop.stop] &&
                    seqMap[fromStop.stop] !== undefined &&
                    seqMap[toStop.stop] !== undefined
                ) {
                    validPairs.push({
                        route,
                        bound: stopsInRoute[0].bound,
                        serviceType: stopsInRoute[0].service_type,
                        fromStop,
                        toStop,
                    });
                }
            }
        }

        // Sort valid pairs by distance of fromStop first (nearest first)
        validPairs.sort((a, b) => (a.fromStop.distance + b.fromStop.distance) * -1);

        // Only keep up to 3 pairs per route
        if (validPairs.length > 0) {
            results.push(...validPairs.slice(0, 1));
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

    return results.slice(0, 30); // Return at most 30 records for display
}

// jQuery document ready function
$(document).ready(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const fromLat = parseFloat(urlParams.get('fmlat'));
    const fromLong = parseFloat(urlParams.get('fmlong'));
    const toLat = parseFloat(urlParams.get('tolat'));
    const toLong = parseFloat(urlParams.get('tolong'));
    
    // Check for format parameter
    const format = urlParams.get('format') || 'html'; // Default to HTML if not provided

    console.log('loc: ', fromLat, fromLong, toLat, toLong);

    $('body').append('<div id="results"></div>');
    
    findRoutes(fromLat, fromLong, toLat, toLong).then(routes => {
        
        if (routes.length === 0 || !urlParams.has('fmlat')) { 
            $("#results").append("<p>No routes found. Usage: kmb.html?fmlat=<latitude>&fmlong=<longitude>&tolat=<latitude>&tolong=<longitude>&format=json</p>");
            return;
        }

        if (format === 'json') {
            $("#results").append(`<pre>${JSON.stringify(routes, null, 2)}</pre>`); // Show JSON formatted output directly in HTML
            return;
        }

        console.log('Found Routes:', routes);

        $("#results").append('<table border="1"><tr><th>Route</th><th>Bound</th><th>Service Type</th><th>From Stop</th><th>To Stop</th></tr>');
        
        routes.forEach(v => {
            $("#results table").append(`
                <tr>
                    <td>${v.route}</td>
                    <td>${v.bound}</td>
                    <td>${v.serviceType}</td>
                    <td>${v.fromStop.name_tc} (${v.fromStop.stop}) - Distance: ${v.fromStop.distance.toFixed(2)} km</td>
                    <td>${v.toStop.name_tc} (${v.toStop.stop}) - Distance: ${v.toStop.distance.toFixed(2)} km</td>
                </tr>
            `);
        });
        
        $("#results").append('</table>');
        
        if (routes.length === 0) {
            $("#results").append("<p>No routes found.</p>");
        }
        
    });
});