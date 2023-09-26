require('dotenv').config();
const cors = require('cors')
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002 ;
const products_routes = require("./routes/products")
const connectDB = require("./db/connect")

app.use(cors());
app.get("/", (req,res) =>{
    res.send("hi, i'm live");
});


// middleware or set router
app.use("/api/products", products_routes);

const start = async ()=>{
    try{
      await connectDB(process.env.NODE_ENV);
    app.listen(PORT,()=>{
      console.log(`${PORT} Yes i am connected  `)
    })
    }
    catch(error){
      console.log(error)
    }
}

start();