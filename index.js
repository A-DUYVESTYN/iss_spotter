// index.js


const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  for (const i of passTimes) {
    const date = new Date(i.risetime * 1000)

    localDate = date 
      console.log(`Next pass at ${date} for ${i.duration} seconds`)
  }

});


