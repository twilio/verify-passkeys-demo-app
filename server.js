require('dotenv').config(); // read .env files
const express = require('express');
const ngrok = require('ngrok');
const bodyParser = require('body-parser')

const config = require('./lib/config')
const factorsRouter = require('./lib/factors')
const challengesRouter = require('./lib/challenges')

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));
// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
// parse application/json
app.use(bodyParser.json())

app.use('/config', config.router)
app.use('/factors', factorsRouter)
app.use('/challenges', challengesRouter)

// Redirect all traffic to index.html
app.use((req, res) =>
    res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
const server = app.listen(port, () => Promise.resolve("http://localhost:3000")// ngrok.connect(port)  //Promise.resolve("http://localhost:3000")
    .then((url) => {
        config.setUrl(url)
        console.log('listening on %d', port);
        console.log('url: %s', config.getUrl());
        console.log('host: %s', config.getHostName());
    }));

server.on("close", () => ngrok.disconnect(config.getUrl())
    .then(() => {
        console.log('disconnect %s', url);
    }));

