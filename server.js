/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Manoj Dhami___________________ Student ID: ___121613202___________ Date: ______5/17/2023__________
*  Cyclic Link: _______________________________________________________________
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

// adding a single GET route which returns the JSON object
app.get('/', (req, res) => 
{
    res.json({message: 'API Listening'})
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
