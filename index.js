const express = require('express');
const app = express();
const scraper = require('./scraper');
const cors = require('cors');


app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        message:'scrpping is awesome'
    })
})

app.get('/search/:title',(req,res)=>{
    scraper.searchMovies(req.params.title)
        .then(movies=>{
            res.json(movies);
        })
});
app.get('/movie/:imdbID',(req,res)=>{
    scraper
        .getMovie(req.params.imdbID)
        .then(movie=>{
            res.json(movie);
        })
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listining on ${port}`)
})