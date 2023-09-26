const express = require("express");
const router = express.Router();
const { getAllProducts, getAllStatistics,getAllRanges,getAllcatogery, combinedData } = require('../controllers/products');

// Define routes using the router object
router.route("/").get(getAllProducts); // GET request to the root path ("/")
router.route("/statistics").get(getAllStatistics); // GET request to the "/Testing" path
router.route("/barchart").get(getAllRanges);
router.route("/piechart").get(getAllcatogery);
router.route("/combinedData").get(combinedData); 

module.exports = router;
