require("dotenv").config();
const connectDB = require("./db/connect");
const myModel = require("./models/product");
const ProductJson = require("./products.json");
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formattedArray = ProductJson.map(obj => {
  const formattedDate = new Date(obj.dateOfSale);
  // const year = formattedDate.getFullYear();
  const month = formattedDate.getMonth()+1;
  return {...obj,month,dateOfSale: formattedDate};
});

console.log(ProductJson);
const Start = async () => {
  try {
    await connectDB(process.env.NODE_ENV);
    await myModel.deleteMany();
    await myModel.create(formattedArray);
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};

Start();
