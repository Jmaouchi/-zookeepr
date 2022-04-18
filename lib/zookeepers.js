const fs = require("fs");
const path = require("path");

function filterByQuery(query, zookeepers) {
  let filteredResults = zookeepers;
  //if they add an age query like ==> animals?age=2 then filter the data and give them only the data that has age = 2
  if (query.age) {
    filteredResults = filteredResults.filter(
      // Since our form data will be coming in as strings, and our JSON is storing
      // age as a number, we must convert the query string to a number to
      // perform a comparison:
      (zookeeper) => zookeeper.age === Number(query.age) // zookeeper is every element in that zookeepers data (if zookeepers is 10 then zookeeper is 1)
    );
  }
  if (query.favoriteAnimal) {
    filteredResults = filteredResults.filter(
      (zookeeper) => zookeeper.favoriteAnimal === query.favoriteAnimal
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (zookeeper) => zookeeper.name === query.name
    );
  }
  return filteredResults;
}

function findById(id, zookeepers) {
  const result = zookeepers.filter((zookeeper) => zookeeper.id === id)[0];
  return result;
}

function createNewZookeeper(body, zookeepers) {
  // zookeeper is that data that we are getting from the outside (like user input)
  const zookeeper = body;
  // pull that zookeeper data to the existing zookeepers data 
  zookeepers.push(zookeeper);
  fs.writeFileSync(
    // this is to add the data to the json file 
    path.join(__dirname, "../data/zookeepers.json"),
    // tarnsfer the data to json formating 
    JSON.stringify({ zookeepers }, null, 2)
  );
  return zookeeper;
}


// validation of the data that we are pushing to the json file
function validateZookeeper(zookeeper) {
  if (!zookeeper.name || typeof zookeeper.name !== "string") {
    return false;
  }
  if (!zookeeper.age || typeof zookeeper.age !== "number") {
    return false;
  }
  if (
    !zookeeper.favoriteAnimal ||
    typeof zookeeper.favoriteAnimal !== "string"
  ) {
    return false;
  }

  // if everything is correct then return true and send that file 
  return true;
}

module.exports = {
  filterByQuery,
  findById,
  createNewZookeeper,
  validateZookeeper,
};