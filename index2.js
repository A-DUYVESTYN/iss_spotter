const { nextISSTimesForMyLocation } = require('./iss_promised');


nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  // .catch((error) => {
  //   console.log("It didn't work: ", error.message);
  // });

const printPassTimes = function (passTimes) {
  for (const i of passTimes) {
    const date = new Date(i.risetime * 1000)

    console.log(`Next pass at ${date} for ${i.duration} seconds`)
  }
}


// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then(body => console.log(body));


