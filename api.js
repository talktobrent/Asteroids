#!/usr/bin/node
// NASA Asteroid API search

var http = require('http');
var https = require('https');

// sends error response
function error (res) {
  res.writeHead(res.statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 'error': true }));
}

var server = http.createServer(function (req, res) {
  if (req.method === 'POST') {
    // collects data stream from request
   	let body = '';
   	req.on('data', function (data) {
      body += data;
    });
    // listens for errors
    req.on('error', function (e) {
      error(res);
    });
    req.on('end', function () {
      // creates query for NASA api
      body = JSON.parse(body);
      if (!body.dateStart || !body.dateEnd || !body.within.value) {
        res.statusCode = 400;
        this.emit('error', new Error('missing'));
      }
      let query = `start_date=${body.dateStart}&end_date=${body.dateEnd}&api_key=DEMO_KEY`;
      let miles = body.within.value;
      https.get('https://api.nasa.gov/neo/rest/v1/feed?' + query, (NASA) => {
        // collects data stream from NASA response
  			let body = '';
  			NASA.on('data', (data) => {
    			body += data;
        });
        NASA.on('error', function (e) {
          error(res);
        });
        // finds and compares distance data in NASA response
        NASA.on('end', () => {
          try {
          	var names = [];
    				let asteroids = JSON.parse(body);
          	for (let date of Object.values(asteroids.near_earth_objects)) {
            	for (let rock of date) {
              	if (rock.close_approach_data[0].miss_distance.miles <= miles) {
                	names.push(rock.name);
              	}
            	}
          	}
          // catches bad response from NASA
          } catch (e) {
            res.statusCode = NASA.statusCode;
            this.emit('error', new Error('bad'));
          }
          // sends response to client
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 'asteroids': names }));
  			});
      });
    });
  } else {
    res.end();
  }
});
server.listen(5000);
