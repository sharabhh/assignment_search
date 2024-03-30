import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import dataModel from "./src/models/dataModel.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config()
app
  .get("/", (req, res) => {
    res.send("hellooo");
  })
  .post("/", async (req, res) => {
    try {
      const dataDetails = req.body;
      const newWord = new dataModel({
        name: dataDetails.name,
        username: dataDetails.userName,
        phone: dataDetails.phone,
        email: dataDetails.email,
      });
      const response = await newWord.save();
      res.status(200).json(response);
      console.log(newWord.name);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });


  app.get("/:searchedKeyword", async (req,res)=> {
    try{
        const searchedKeyword = req.params.searchedKeyword
        var dataExists
        dataExists = await dataModel.find({$or: [{username: searchedKeyword}, {email: searchedKeyword}, {phone: Number(searchedKeyword)}]})
        if(dataExists.length > 0) {
          res.send(dataExists)
        }else{

          res.send('data does not exist');
        }
    } catch(err){
        console.log(err);
    }
  })

mongoose.connect(`${process.env.MONGO_URL}`);

app.listen(`${process.env.PORT}`, () => {
  console.log("server running on 3001");
});
