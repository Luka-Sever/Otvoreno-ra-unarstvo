const express = require("express");
const cors = require("cors");
const mongo = require("mongodb");
const mongoose = require("mongoose");

const app = express()

app.use(cors())

const uri = "mongodb+srv://lukasever20_db_user:CmEFXS26TulwSuTC@cluster0.xotdmaq.mongodb.net/satelitiDB?appName=Cluster0";

mongoose.connect(uri).then(res => {
    console.log("Connected to database");
});

const schema = new mongoose.Schema({
  ime_satelita: { type: String, required: true },
  drzava_porijekla: { type: String, required: true },
  drzava_odrzavanja: { type: String, required: true },
  vlasnik: { type: String, required: true },
  korist: { type: String, required: true },
  orbita: { type: String, required: true },
  inklinacija: { type: Number, required: true },
  period: { type: Number, required: true },
  svrha: { type: String, required: true },
  perigej: { type: Number, required: true },
  apogej: { type: Number, required: true }
});

const Sateliti = mongoose.model("Sateliti", schema, "sateliti");

app.get("/api/data", async (req, res) => {
    try {
        const sateliti = await Sateliti.find({}).select("-_id");
        res.json(sateliti)
    } catch (err) {
        console.log(err);
    }
})

app.listen(3000, () => {
    console.log("Running on port 3000");
    
});