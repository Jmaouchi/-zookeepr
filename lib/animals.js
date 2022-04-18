const fs = require("fs");
const path = require("path");


function filterByQuery(query, animalsArray) {

  let personalityTraitsArray = [];

  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      //if the data inside the traits is a string then transfer it to an array 
      // and with that we can loop through the array and get the values 
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    console.log(personalityTraitsArray);
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter( //or data.filter
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }

  //and then it will return the filtred result 
  return filteredResults;
}

// findById function 
function findById(id, animalsArray) {
  // this will filter thru the animal data and search for a specific animal id and return the result using the animal id 
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}



// Create a new annimal array function 
// this is for the post method
function createNewAnimal(body, animalsArray){//the body is the data we are posting and animalsArray is where we are posting it to
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, '../data/animals.json'),//__dirname which represents the directory of the file we execute the code in, with the path to the animals.json file.
    // this is to save the posted data array to a json  
    JSON.stringify({ animals: animalsArray }, null, 2)//The null argument means we don't want to edit any of our existing data; if we did, 
    //we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable
  );
  return animal;
}


// validate animal function
//this function will retun a false whenever the data posted is not formated correctly
function validateAnimal(animal) {
  //if the animal name is empty or its not inside of a string then return a false 
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  //if the animal species is empty or its not inside of a string then return a false 
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  //if the animal diet is empty or its not inside of a string then return a false 
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  //if the animal personanlityTraits is empty or its not inside of an array then return a false 
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}


module.exports = {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal
};