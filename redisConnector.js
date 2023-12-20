let redis = require("redis");
let redisClient;
(async () => {
    redisClient = redis.createClient({
        host: "127.0.0.1",
        port: 6379
    });

    await redisClient.connect();
})();

redisClient.on("ready", function () {
    console.log("Connected to Redis server successfully");
});

redisClient.on("error", function (err) {
    console.log("redis error: ", err);
});

module.exports = redisClient;

