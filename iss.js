const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const data = JSON.parse(body);
    callback(error, data.ip);

  });

};

const fetchCoordsByIP = function(ip, callback) {
  request("http://ipwho.is/" + ip, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }
    const dataParse = JSON.parse(body);

    // if non-200 status, assume server error
    if (!dataParse.success) {
      callback(`Success status was ${dataParse.success}. Server message says: ${dataParse.message} when fetching for IP ${dataParse.ip}`, null);
      return;
    }

    const latitude = dataParse.latitude;
    const longitude = dataParse.longitude;

    callback(error, {latitude, longitude});
  });
};

// https://iss-pass.herokuapp.com/json/?lat=YOUR_LAT_INPUT_HERE&lon=YOUR_LON_INPUT_HERE

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    const dataParse = JSON.parse(body);
    if (dataParse.message !== "success") {
      callback(`Success status was ${dataParse.success}. Server message says: ${dataParse.message} when fetching for coordinates ${coords.latitude}, ${coords.longitude}`, null);
      return;
    }
    callback(error, dataParse.response)
  });

};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  
  fetchMyIP((error,ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error,coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error,flyovers) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, flyovers)
        
      })
    })
  })
}

module.exports = { nextISSTimesForMyLocation };