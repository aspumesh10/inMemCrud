#setup

1.  setup redis in the system using below process
https://redis.io/docs/install/install-redis/install-redis-on-mac-os/
https://redis.io/docs/install/install-redis/install-redis-on-linux/
make sure to have redis installed before running the app

2.  npm run install to install the node modules

3.  npm run dev     -- to run using nodemon
    npm run prod    -- to run with prod env

4. use postman collection to view all apis

5. update below properties in app.js to update the max nodes, base port and load balacer port
if MAX_SERVERS = 5 then the child nodes will run on port range 3001-3005

const MAX_SERVERS = 5;
const BASE_PORT = 3000;
const LOAD_BALANCER_PORT = 80;