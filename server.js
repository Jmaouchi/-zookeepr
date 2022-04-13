const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data (it will parse any data that is coming from the outside of the server)
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json()) // The express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object


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

function findById(id, animalsArray) {
  // this will filter thru the animal data and search for a specific animal id and return the resul using the animal id 
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

// this is for the post method
function createNewAnimal(body, animalsArray){//the body is the data we are posting and animalsArray is where we are posting it to
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),//__dirname which represents the directory of the file we execute the code in, with the path to the animals.json file.
    // this is to save the poster data array to a json formating, to add it to the 
    JSON.stringify({ animals: animalsArray }, null, 2)//The null argument means we don't want to edit any of our existing data; if we did, 
    //we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable
  );
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}


// first root to animals endpoint or first role for getting data from the server 
app.get('/api/animals', (req, res) => {
  let results = animals;
  // the req.query = url/query or it will add that query to thd end of the url
  if (req.query) {
    // if they provide a query parametre than call this function 
    results = filterByQuery(req.query, results);
  }
  // if there is no query provided than return the whole data as json 
  res.json(results);

});



// second root to animals endpoint or second role for getting data from the server 
app.get('/api/animals/:id', (req, res) => { //get is a route of the app method 
  // the req.params = url/params or it will add that param to thd end of the url
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});


app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.'); // this status send is for the client to tell them what happen and whats missing
    // everthing that is 400 range means that its the user error and not the server
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});



app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
