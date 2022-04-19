const router = require("express").Router();
// this is to bring the function that the routers used from another file 
const { filterByQuery,
      findById,
      createNewZookeeper,
      validateZookeeper } = require('../../lib/zookeepers');
// this is to bring the animal json data array
const { zookeepers } = require('../../data/zookeepers.json');



// first root to zookeepers endpoint or first role for getting data from the server 
router.get('/zookeepers', (req, res) => {
  // get the data from zookeepers variable
  let results = zookeepers;
  // the req.query = url/query or it will add that query to thd end of the url
  if (req.query) {
    // if they provide a query parametre than call this function 
    results = filterByQuery(req.query, results);
  }
  // if there is no query provided than return the whole data as json 
  res.json(results);

});

// second root to zookeepers endpoint or second role for getting data from the server 
router.get('/zookeepers/:id', (req, res) => { //get is a route of the app method 
  // the req.params = url/params or it will add that param to the end of the url
  const result = findById(req.params.id, zookeepers);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});


// post data to add a zookeeper 
router.post('/zookeepers', (req, res) => {
  req.body.id = zookeepers.length.toString();

  if (!validateZookeeper(req.body)) {
    res.status(400).send('The zookeeper is not properly formatted.');
  } else {
    const zookeeper = createNewZookeeper(req.body, zookeepers);
    res.json(zookeeper);
  }
});

// post route needed 

module.exports = router;