const express = require("express");
const app = express();
const crypto = require("crypto");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
//data
// const ARTISTS = [
//   {
//     id: 1,
//     name: "Tyler the Creator",
//     imageURL:
//       "https://i.scdn.co/image/ab676161000051748278b782cbb5a3963db88ada",
//     age: 70,
//   },
//   {
//     id: 2,
//     name: "Kanye West",
//     imageURL:
//       "https://www.thenews.com.pk/assets/uploads/updates/2023-05-15/1070367_8385471_Untitled-1_updates.jpg",
//     age: 45,
//   },
// ];

//Artist schema
const ArtistSchema = new mongoose.Schema({
  name:String,
  age:Number,
  imageURL:String
})
//Song Schema
const SongSchema = new mongoose.Schema({
  title:String,
  duration:Number,
  cover:String,
  releaseYear:Number,
  artistID:{type:mongoose.Schema.Types.ObjectId,ref:'Artists'}

})
//Artist Model
const ArtistModel = mongoose.model('Artists',ArtistSchema);
//SOng Mode
const SongModel = mongoose.model('Songs', SongSchema);

//MONGO DATABASE CONNECTION
DB_CONNECTION = process.env.DB_CONNECTION
DB_PASSWORD = process.env.DB_PASSWORD
mongoose.connect(DB_CONNECTION.replace("<password>",DB_PASSWORD))
.then(()=>console.log("Mongo DB Connected!"))



app.get("/api", (req, res) => {
  res.send("Welcome to Our API!");
});

//CRUD - CREATE READ UPDATE DELETE
//STATUS CODES - 200,201,202, 404, 204

//get All Artists
app.get("/api/artists", async(req, res) => {
  const { name } = req.query;
  const artists = await ArtistModel.find();
  console.log(artists)
  if (name === undefined) {
    res.status(200).send({
      data: artists,
      message: "data get success!",
    });
  } else {
    res.status(200).send({
      data: artists.filter((x)=>x.name.toLowerCase().trim().includes(name.toLowerCase().trim())),
      message: "data get success!",
    });
  }
});
//get Artists by ID
app.get("/api/artists/:id", async(req, res) => {
  const id = req.params.id;
  console.log(id)
  const artist = await ArtistModel.findById(id);
  console.log('artist found',artist)
  if (!artist) {
    console.log("test");
    res.status(204).send("artist not found!");
    // return;
  } else {
    res.status(200).send({
      data: artist,
      message: "data get success!",
    });
    // return;
  }
});
//delete artist by ID
app.delete("/api/artists/:id", async(req, res) => {
  const id = req.params.id;
  const artist = await ArtistModel.findByIdAndDelete(id);
  if (artist === undefined) {
    res.status(404).send("artist not found");
  } else {
    res.status(203).send({
      data: artist,
      message: "artist deleted successfully",
    });
  }
});
//post
app.post("/api/artists", async(req, res) => {
  const { name, age, imageURL } = req.body;
  const newArtist = new ArtistModel({
    name: name,
    imageURL: imageURL,
    age: age,
  });
  // ARTISTS.push(newArtist);
  await newArtist.save()
  res.status(201).send("created");
});
//put
app.put("/api/artists/:id", async(req, res) => {
  const id = req.params.id;
  const { name, age, imageURL } = req.body;
  const existedArtist = await ArtistModel.findByIdAndUpdate(id,{name:name, age:age, imageURL:imageURL})
  if (existedArtist == undefined) {
    res.status(404).send("artist not found!");
  } else {
    res.status(200).send(`${name} updated succesfully`);
  }
});


//SONGS ---------------------------------------------
app.get("/api/songs/:id", async(req,res)=>{
  const id = req.params.id
  const songs = await SongModel.find()
  
  if(songs==undefined){
    res.status(404).send("songs not found!");
  }
  else{
    res.status(200).send(songs.filter((song)=>song.artistID==id))
  }
})

app.get("/api/songs/", async(req,res)=>{
  const songs = await SongModel.find()
  
  if(songs==undefined){
    res.status(404).send("songs not found!");
  }
  else{
    res.status(200).send(songs)
  }
})

app.post("/api/songs",async(req,res)=>{
  const{title,duration,cover,releaseYear,artistID}=req.body;

  const song = new SongModel({
    title:title,
    duration:duration,
    cover:cover,
    releaseYear:releaseYear,
    artistID:artistID
  })
  await song.save();
  res.status(201).send("song created succesfully")
})

app.delete("/api/songs/:id", async(req,res)=>{
  const id = req.params.id
  const deletedSong= await SongModel.findByIdAndDelete(id);
  if(!deletedSong){
    res.status(404).send('song not found');
  }
  else{
    res.status(203).send({data:deletedSong, message:'song deleted succesfully'})
  }
})

PORT  = process.env.PORT;
app.listen(PORT, () => {
    console.log(`NODE APP listening on port ${PORT}`);
});