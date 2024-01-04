const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const port = 3000;

//connect co so du lieu
mongoose.connect('mongodb://localhost:27017/manhlv');

const SongSchema = new mongoose.Schema({
    name: String,
    author: String,
    size: Number,
    views: {
        type: Number,
        default: 0
    }
});
const Song = mongoose.model('Song', SongSchema);

app.use(bodyParser.json());
//getall
app.get('/api/songs', async (req, res)=>{
    try {
        const songs = await Song.find();
        res.json(songs)
    } catch (error) {
        res.status(500).json({error: error.message});

    }
})
//create song
app.post('/api/songs', async (req, res)=>{
    const {name, author, size, views} = req.body;
    try {
       const newSong = new Song({name, author, size, views});
       const savedSong = await newSong.save();
       res.json(savedSong); 
    } catch (error) {
        res.status(500).json({error: error.message});

    }
})
//find by id
app.get('/api/songs/:id', async (req, res)=>{
    try {
      const song = await Song.findById(req.params.id)
      if(!song) {
         return res.status(404).json({error: "Song not found"})
      }
      res.json(song)
    } catch (error) {
        res.status(500).json({error: error.message});

    }
})
//update song
app.put('/api/songs/:id', async (req, res)=> {
    const {name, author, size, views} = req.body;
    try {
       const updateSong = await Song.findByIdAndUpdate(
        req.params.id,
        { name, author, size, views },
    { new: true }
       );
       if(!updateSong){
        return res.status(404).json({error: "Song not found"})
       }
       res.json(updateSong);
    } catch (error) {
        res.status(500).json({error: error.message});

    }
});
//delete
app.delete('/api/songs/:id', async (req, res)=> {
    try {
       const deleteSong = await Song.findByIdAndDelete(req.params.id);
       if(!deleteSong) {
        return res.status(404).json({error: "Song not found"})
     }
     res.json({success: "delete success"})
    } catch (error) {
        res.status(500).json({error: error.message});

    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });