require('dotenv').config();
import express from "express";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connection from "./config/connectDB";
import bodyParser from "body-parser";


let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// config view engine
viewEngine(app);



//init all web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, ()=>{
   console.log(`App is running at the ${port}`);
});