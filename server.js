/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Manoj Dhami___________________ Student ID: _121613202_________________ Date: ____6/4/2023________________
*
********************************************************************************/ 





// Setup
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const HTTP_PORT = process.env.PORT || 8080;
require('dotenv').config(); 
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();



//middleware
app.use(cors());
app.use(express.json())
//app.use(express.static("Js"));
app.use('/js', express.static(__dirname + "/js/"));
app.use('/CSS', express.static(__dirname + "/CSS/"));
// adding a single GET route which returns the JSON object
app.get('/', (req, res) => 
{
    res.sendFile(__dirname + "/index.html")
    // res.json({message: 'API Listening'})
})

app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
      .then((newMovie) => {
        res.status(201).json(newMovie);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

app.get('/api/movies', (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const title = req.query.title;
  
    db.getAllMovies(page, perPage, title)
      .then((movies) => {
        res.json(movies);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

app.get('/api/movies/:id', (req, res) => {
    const id = req.params.id;
  
    db.getMovieById(id)
      .then((movie) => {
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

app.put('/api/movies/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
  
    db.updateMovieById(data, id)
      .then(() => {
        res.json({ message: 'Movie updated successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

  // DELETE /api/movies/:id
app.delete('/api/movies/:id', (req, res) => {
    const id = req.params.id;
  
    db.deleteMovieById(id)
      .then(() => {
        res.json({ message: 'Movie deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

// Tell the app to start listening for requests
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
