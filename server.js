const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3030;

const server = http.createServer(app);

server.listen(PORT , ()=>{
    console.log(`port is listen on ${PORT}`);
})