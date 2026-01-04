const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://lukasever20_db_user:CmEFXS26TulwSuTC@cluster0.xotdmaq.mongodb.net/satelitiDB?appName=Cluster0";

mongoose.connect(uri).then(res => {
  console.log("Connected to database");
});

const schema = new mongoose.Schema({
  "ime satelita": { type: String, required: true },
  "drzava porijekla": { type: String, required: true },
  "drzava odrzavanja": { type: String, required: true },
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

// pomoćna funkcija vraća objekt filtriran sa stranice
function buildFilter(customSearchColumn, customSearchValue) {
  if (!customSearchValue.trim()) return {}; //prazan string nas ne zanima

  const searchValue = String(customSearchValue).trim();

  if (customSearchColumn && customSearchColumn !== "all") {
    const numericFields = ['inklinacija', 'period', 'perigej', 'apogej']; // brojevi su malo problematični
    if (numericFields.includes(customSearchColumn)) {
      const numValue = parseFloat(searchValue);
      if (!isNaN(numValue)) {
        return { [customSearchColumn]: numValue };
      }
      return {};
    }
    return { [customSearchColumn]: { $regex: searchValue, $options: "i" } }; 
        // regex je uvijek samo vrijenost koju tražimo, "i" znači da nas velika i mala slova ne zanimaju.

  }

  // (Svi stupci)
  const regex = { $regex: searchValue, $options: "i" };
  return {
    $or: [
      { "ime satelita": regex },
      { "drzava porijekla": regex },
      { "drzava odrzavanja": regex },
      { vlasnik: regex },
      { korist: regex },
      { svrha: regex },
      { orbita: regex }
    ]
  };
}

// Glavni endpoint za podatke
app.get("/search", async (req, res) => {
  try {
    // ovi podaci su samo za DataTable, da stranica zna koliko podataka prikazati itd.
    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    
    // odabrani stupac
    const customSearchColumn = req.query.customSearchColumn;
    const customSearchValue = req.query.customSearchValue || "";
    
    const filter = buildFilter(customSearchColumn, customSearchValue);
    const totalRecords = await Sateliti.countDocuments();
    const filteredRecords = await Sateliti.countDocuments(filter);

    const data = await Sateliti.find(filter)
      .skip(start)
      .limit(length)
      .lean(); // vrati kao JSON, bez pretvaranja u objekt za MongoDB

    res.json({
      draw,
      recordsTotal : totalRecords,
      recordsFiltered: filteredRecords,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allSatellites", async (req, res) => {
  const data = await Sateliti.find().lean();
  res.status(200).send(data);
});

app.get("/americans", async (req, res) => {
  const response = await Sateliti.find( {"drzava porijekla" : "SAD"}).lean();
  res.status(200).send(response);
});

app.get("/leo", async (req, res) => {
  const response = await Sateliti.find( {"orbita" : "LEO"} ).lean();
  res.status(200).send(response);
});

app.get("/meo", async (req, res) => {
  const response = await Sateliti.find( {"orbita" : "MEO"} ).lean();
  res.status(200).send(response);
});

app.get("/satellites/api/v1/:satelliteId" ,async (req, res) => {
  const satelliteId = req.params.satelliteId;
  try {
    const response = await Sateliti.findOne({ "_id" : satelliteId}).lean();
    if (!response) {
      return res.status(404).json({
        error: "Satelit nije pronađen",
        querry: satelliteId
      });
    }
    
    res.json(response);
  } catch (e) {
    res.status(500).json({
      error: "Greška u bazi"
    });
  }
});

app.post("/satellite/api/v1", async (req, res) => {
  try {
    const {
      "ime satelita": imeSatelita,
      "drzava porijekla": drzavaPorijekla,
      "drzava odrzavanja": drzavaOdrzavanja,
      vlasnik,
      korist,
      orbita,
      inklinacija,
      period,
      svrha,
      perigej,
      apogej
    } = req.body;
  

  if (!imeSatelita ||
      !drzavaPorijekla ||
      !drzavaOdrzavanja ||
      !vlasnik ||
      !korist ||
      !orbita ||
      inklinacija == null ||
      period == null ||
      !svrha ||
      perigej == null ||
      apogej == null) {
        res.status(400).json({error : "Nedostaju podaci o satelitu!"});
      }

      const noviSatelit = await Sateliti.create({
        "ime satelita": imeSatelita,
        "drzava porijekla": drzavaPorijekla,
        "drzava odrzavanja": drzavaOdrzavanja,
        vlasnik,
        korist,
        orbita,
        inklinacija,
        period,
        svrha,
        perigej,
        apogej
      });

      res.status(201).json(noviSatelit);
    } catch (err) {
      res.status(500).json({ error : "Greška tokom spremanaj u bazu"})
    }
});

app.put("/satellite/api/v1/:satelliteId", async (req, res) => {
  try {
    const {
      "ime satelita": imeSatelita,
      "drzava porijekla": drzavaPorijekla,
      "drzava odrzavanja": drzavaOdrzavanja,
      vlasnik,
      korist,
      orbita,
      inklinacija,
      period,
      svrha,
      perigej,
      apogej
    } = req.body;
    const satelitZaPromjenu = {
      "ime satelita": imeSatelita,
      "drzava porijekla": drzavaPorijekla,
      "drzava odrzavanja": drzavaOdrzavanja,
      "vlasnik" : vlasnik,
      "korist" : korist,
      "orbita" : orbita,
      "inklinacija" : inklinacija,
      "period" : period,
      "svrha" : svrha,
      "perigej" : perigej,
      "apogej" : apogej
    }
    const satelliteId = req.params.satelliteId;
    const response = await Sateliti.findOne({ "_id" : satelliteId}).lean();
    if (!response)
      return res.status(404).json( { error: "Ne postoji objekt u bazi!"});
    await Sateliti.findOneAndUpdate(satelitZaPromjenu);
    res.status(200).json({ message : "Satelit osvježen!"});
  } catch (err) {
    res.status(500).json({ error: "Greška u komunikaciji s bazom"});
  }
});

app.delete("/satellite/api/v1/:satelliteId", async (req, res) => {
  try {
    const {
      "ime satelita": imeSatelita,
      "drzava porijekla": drzavaPorijekla,
      "drzava odrzavanja": drzavaOdrzavanja,
      vlasnik,
      korist,
      orbita,
      inklinacija,
      period,
      svrha,
      perigej,
      apogej
    } = req.body;
    const satelitZaBrisanje = {
      "ime satelita": imeSatelita,
      "drzava porijekla": drzavaPorijekla,
      "drzava odrzavanja": drzavaOdrzavanja,
      "vlasnik" : vlasnik,
      "korist" : korist,
      "orbita" : orbita,
      "inklinacija" : inklinacija,
      "period" : period,
      "svrha" : svrha,
      "perigej" : perigej,
      "apogej" : apogej
    }
    const satelliteId = req.params.satelliteId;
    const response = await Sateliti.findOne({ "_id" : satelliteId}).lean();
    if (!response)
      return res.status(500).json( { error: "Ne postoji objekt u bazi!"});
    await Sateliti.findOneAndDelete(satelitZaBrisanje);
    res.status(200).json({ message : "Satelit izbrisan!"});
  } catch (err) {
    res.status(500).json({ error: "Greška u komunikaciji s bazom"});
  }

});

app.use((req, res) => {
  res.status(404).json({ error: "Ova stranica ne postoji."});
})

app.listen(3000, () => {
  console.log("Running on port 3000");
});
