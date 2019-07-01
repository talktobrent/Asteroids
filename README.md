# Asteroids
1.0 - Accept a request via HTTP POST. The request will be JSON formatted, and will have the following pattern: 
{ 
  "dateStart": "2019-01-01", 
  "dateEnd": "2019-01-07", 
  "within": { 
    "value": 9000000, 
    "units": "miles" 
  } 
} 
1.1 - You may assume that the request will always have units == miles. 
1.2 - Perform a request to the NASA NeoWS API to get information about asteroids expected to pass near the earth during the specified range.  https://api.nasa.gov/api.html#NeoWS (You may need to sign up for an API key). Filter the result to include only asteroids with a nearest approach less than or equal to the requested distance. 
1.3 - Respond to the original request with a list of asteroid names that will pass within the specified distance and date range 
{ 
  "asteroids": [ 
    "(2017 MZ)" 
  ] 
} 
- If there are no matching results, return an empty array. 
{ 
  "asteroids": [] 
} 
- If there is any kind of error, just return a response with a boolean: 
{ 
  "error": true 
}
