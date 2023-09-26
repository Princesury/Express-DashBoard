  const product = require("../models/product");

  const getAllProductsFunction = async (req, res) => {
    try {
      const {search, price, sort, select } = req.query;
      const queryObject = {};

      if (search) {
        queryObject.title = { $regex: search, $options: "i" };
      }
      if (search) {
        queryObject.price = {$regex: search, $options: "i" };
      }
      if (search) {
        queryObject.description = {$regex: search, $options: "i" };
      }
      let ApiData = product.find(queryObject);

      // sort the value asc to desc
      if (sort) {
        let sortFix = sort.replace(",", " ");
        ApiData = ApiData.sort(sortFix);
      }

      // select the single key by using selct keyword

      if (select) {
        let selectfix = select.split(",").join(" ");
        ApiData = ApiData.select(selectfix);
      }

      // Pagination
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 6;
      let skip = (page - 1) * limit;
      ApiData = ApiData.skip(skip).limit(limit);

      const data = await ApiData;
      return data;
    } catch (error) {
      return error;
    }
  };

  const getAllProducts = async (req, res) => {
    try {
      const data = await getAllProductsFunction(req, res);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


  const getAllStatisticsFunction = async (req, res) => {
    try {
      const { month } = req.query;

      //lets find the monthly statistics
      const allSoldItems = await product.find({ sold: true, month }).countDocuments();
      const allNotSoldItems = await product.find({ sold: false, month }).countDocuments();

      const totalSaleAmount = await product.aggregate([
        {
          $match: {
            sold: true,
            month: parseInt(month),
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
          },
        },
      ]);
      return { allSoldItems, allNotSoldItems, totalSaleAmount };
    } catch (error) {
      return error;
    }
  };

  const getAllStatistics = async (req, res) => {
    try {
      const data = await getAllStatisticsFunction(req, res);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  const getAllRangesFunction = async (req, res) => {
    try {
      const { month } = req.query;

      //month is a number between 1 and 12
      //lets define the price ranges
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: 1000000000 },
      ];

      //find products in the specified price range for the selected month
      const results = [];
      for (i = 0; i < priceRanges.length; i++) {
        const { min, max } = priceRanges[i];
        const totalItems = await product
          .find({ month, price: { $gte: min, $lte: max } })
          .countDocuments();
        results.push({ min, max, totalItems });
      }

      return results;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const getAllRanges = async (req, res) => {
    try {
      const data = await getAllRangesFunction(req, res);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const getAllcatogeryFunction = async (req, res) => {
    try {
      const { month } = req.query;

      const aggregationPipeline = [
        {
          $match: {
            month: parseInt(month), // Convert to integer for matching
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            count: 1,
          },
        },
      ];

      // Execute the aggregation
      const results = await product.aggregate(aggregationPipeline);
      return results;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const getAllcatogery = async (req, res) => {
    try {
      const data = await getAllcatogeryFunction(req, res);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const combinedData = async (req, res) => {
    try {
      const { month } = req.query;
  
      const [allProducts, allStatistics, allRanges, allCategory] = await Promise.all([
        getAllProductsFunction(req, res),
        getAllStatisticsFunction(req, res),
        getAllRangesFunction(req, res),
        getAllcatogeryFunction(req, res),
      ]);
  
      res.status(200).json({ allProducts, allStatistics, allRanges, allCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  



  module.exports = {
    getAllProducts,
    getAllStatistics,
    getAllRanges,
    getAllcatogery,
    combinedData,
  };
