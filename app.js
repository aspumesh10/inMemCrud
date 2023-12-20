'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');
const cluster = require('node:cluster');
// const numCPUs = require('node:os').availableParallelism(); //we can use this to have better parellelism
const process = require('node:process');


const router = require('./router.js')

const MAX_SERVERS = 5;
const BASE_PORT = 3000;
const LOAD_BALANCER_PORT = 80;
let currentServerIndex = 0; //this count used in identifying the server

if (cluster.isPrimary) {
    console.log("Running primary Load balancer");

    //spawn MAX_SERVERS child processes
    let backendServers = []
    for (let i = 1; i <= MAX_SERVERS; i++) {
        let port = BASE_PORT + i;
        cluster.fork({ "PORT": port }); //pass the port via env variable
        backendServers.push("http://localhost:"+port);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

    const app = express();
    //create proxy on load balancer to reroute requests
    const proxy = httpProxy.createProxyServer();
    app.all('*', (req, res) => {
        console.log(req.url)
        console.log(req.headers.host)
        // Get the next backend server
        const targetServer = backendServers[currentServerIndex] ;
        console.log("Hitting server with url -> ", targetServer)
        currentServerIndex = (currentServerIndex + 1) % backendServers.length;

        // Proxy the request to the selected backend server
        proxy.web(req, res, { target : targetServer }, (err) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        });
    });

    // Error handling for the proxy
    proxy.on('error', (err, req, res) => {
        console.error('Proxy server error:', err);
        res.status(500).send('Proxy server error');
    });

    // Start the load balancer on port 3000
    app.listen(LOAD_BALANCER_PORT, () => {
        console.log(`Load balancer running on port ${LOAD_BALANCER_PORT}`);
    });

} else {
    console.log(`Running worker server with port ${process.env.PORT}`)
    const childApp = express();
    childApp.use(bodyParser.urlencoded({
        extended: true, limit: '60mb'
    }));

    childApp.use(bodyParser.json());
    childApp.get("/", (req, res)=>{
        console.log("Hitting get request on root")
        return res.status(200).json({message: "All ok", status : 200})
    });

    childApp.listen(process.env.PORT);
    router(childApp);
    //setup redisClient
  	global.redisConnection = require("./redisConnector.js");
}
