const router = require("express").Router();
// this is to bring the function that the routers used from another file 
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
// this is to bring the animal json data array
const { animals } = require('../../data/animals');


// first root to animals endpoint or first role for getting data from the server 
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => { //get is a route of the app method 
  // the req.params = url/params or it will add that param to the end of the url
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});


// all routes that has the term api in it will deal in transference of JSON data,
router.post('/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is false, send 400 error back
  if (!validateAnimal(req.body)){
    res.status(400).send('The animal is not properly formatted.'); // this status send is for the client to tell them what happen and whats missing
    // everthing that is 400 range means that its the user error and not the server
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});


module.exports  = router;