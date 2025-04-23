require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require("dns");
const urlParser = require("url");
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urls = [];
let id = 1;

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  const parsedURl = urlParser.parseInt(originalUrl);

  dns.lookup(parsedURl.hostname, (err) => {
    if (err || !parsedURl.protocol.startsWith("http")) {
      return res.json({error: "invalid url" });
    }
   
    urls.push({original_url: originalUrl, short_url: id});
    res.json({original_url: originalUrl, short_url: id});
    id++;
  });
});

// Your first API endpoint
app.get('/api/shorturl/:short_url', (req, res) => {
  const short = parseInt(req.params.short_url);
  const found = urls.find((entry) => entry.short_url === short);
  
  if (found) {
    res.redirect(found.original_url);
  } else {
    res.json({error: "No short URL found for the given input"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
