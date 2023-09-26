const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let configuration = {};
const requests = {};

app.post('/configure', (req, res) => {
    console.log(req.body);
    if(!req.body.client || !req.body.routes || req.body.client.length ==0 || req.body.routes.length==0){
        return res.sendStatus(400)
    }
    const clients = req.body.client;
    const routes = req.body.routes;
    routes.map(route=>{
        if(!route.sourcePath || !route.destinationUrl){
            return res.sendStatus(400);
        }
        requests[route.sourcePath] = route.destinationUrl;
    });
    let clientsFinal = [];
    clients.map(client=>{
        if(!client.clientId){
            return res.sendStatus(400);
        }
        if(!client.limit){
            client.limit = 1;
        }
        if(!client.seconds){
            client.seconds=1;
        }
        clientsFinal.push(client);
        configuration[client.clientId] = client;
    });
    
    res.sendStatus(200);
});

app.all('*', (req, res) => {
    const path = req.path;
    
    res.sendStatus(500);
});

module.exports = app;
