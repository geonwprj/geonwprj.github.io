// Create a Redis client
let redisClient;

// Function to connect to the Redis server
function connectRedis(host, port) {
    redisClient = redis.createClient(port, host);
    
    redisClient.on('connect', function() {
        console.log('Connected to Redis server');
    });

    redisClient.on('error', function(err) {
        console.error('Redis connection error: ' + err);
    });
}

// Function to disconnect from the Redis server
function disconnectRedis() {
    if (redisClient) {
        redisClient.quit(function(err) {
            if (err) {
                console.error('Error disconnecting from Redis: ' + err);
            } else {
                console.log('Disconnected from Redis server');
            }
        });
    }
}

// Function to add or update a record in Redis
function setRecord(key, value) {
    redisClient.set(key, value, function(err, reply) {
        if (err) {
            console.error('Error setting record: ' + err);
        } else {
            console.log('Record set: ' + reply);
        }
    });
}

// Function to delete a record from Redis
function deleteRecord(key) {
    redisClient.del(key, function(err, reply) {
        if (err) {
            console.error('Error deleting record: ' + err);
        } else {
            console.log('Record deleted: ' + reply);
        }
    });
}

