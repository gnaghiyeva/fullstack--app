const express = require('express')
const app = express()
const crypto = require('crypto');
// let uuid = crypto.randomUUID(); generating unique id
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

const mongoose = require('mongoose');

const dotenv= require('dotenv')
dotenv.config()

//data
const ARTISTS=[
    {
        id:1,
        name:'Tyler the Creator',
        imageURL: "https://i.scdn.co/image/ab676161000051748278b782cbb5a3963db88ada",
        age:45
    },
    {
        id:2,
        name:'Kenye Wate',
        imageURL:"https://www.thenews.com.pk/assets/uploads/updates/2023-05-15/1070367_8385471_Untitled-1_updates.jpg",
        age:30
    }

]
//artists schema
const ArtistSchema = new mongoose.Schema({
  name:String,
  age:Number,
  imageURL:String
})

//artist model
const ArtistModel = mongoose.model('Artists', ArtistSchema)


//MONGO database
DB_CONNECTION = process.env.DB_CONNECTION
DB_PASSWORD = process.env.DB_PASSWORD
DB_CONNECTION = DB_CONNECTION.replace("<password>",DB_PASSWORD)
mongoose.connect(DB_CONNECTION)
.then(()=>console.log("Mongo DB connected"))
console.log(app)
app.get('/api', (req, res) => {
  res.send('Hello World!')
})
//CRUD


// get all artists
app.get('/api/artists', async(req,res)=>{
  const {name} = req.query;
  const artists = await ArtistModel.find()
  if(name===undefined){
    res.status(200).send({
       data:artists,
       message:'data get success'
    })
  }
  else{
    res.status(200).send({
      // data: ARTISTS.filter((x)=>x.name.toLowerCase().trim().includes(name.toLowerCase().trim())),
      data:artists.filter((x)=>x.name.toLowerCase().trim().includes(name.toLowerCase().trim)),
      message:'data get success'
    });
  }
})

//get Artists by ID
app.get('/api/artists/:id', (req,res)=>{
  const id = req.params.id;
  const artist = ARTISTS.find((x) => x.id == id);
  if(!artist){
    res.status(204).send("artist not found")
    return ;
  }
  else{
    res.status(200).send({
      data:artist,
      message:'data get success'
    })
  }
  res.status(200).send({
     data:ARTISTS,
     message:'data get success'
  })
 })
 
//delete artist by ID
app.delete('/api/artists/:id',(req,res)=>{
  const id = req.params.id;
  const artist = ARTISTS.find((x)=>x.id==id);
  if(!artist){
    res.status(204).send("artist not found");
  }
  else{
    const idx = ARTISTS.indexOf(artist);
    ARTISTS.splice(idx,1);
    res.status(200).send({
      data:artist,
      message:'artist deleted succesfully'
    })
  }
})

app.post('/api/artists',async(req,res)=>{
  const {name,age, imageURL} = req.body;
  
  const newArtist = new ArtistModel({
      name:name,
      imageURL:imageURL,
      age:age
  })
await newArtist.save();  
res.status(201).send('created')
})


//put
app.put('/api/artists/:id', (req,res)=>{
  const id = req.params.id;
  const {name, age, imageURL}=req.body;
  const existedArtist = ARTISTS.find((x)=>x.id==id);
  if(existedArtist==undefined){
    res.status(404).send('artist not found')
  }
  else{
    if(name){
      existedArtist.name=name;
    }
    if(age){
      existedArtist.age=age;
    }
    if(imageURL){
      existedArtist.imageURL=imageURL;
    }
    res.status(200).send(`artist: ${existedArtist.name}`)
  }
})

PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})