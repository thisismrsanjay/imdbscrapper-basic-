const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchUrl = 'https://www.imdb.com/find?&s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl = 'https://www.imdb.com/title/';
const searchCache = {};
const movieCache = {};
function searchMovies(searchTerm){

    if(searchCache[searchTerm]){
        console.log('serving for cache:',searchTerm);
        return Promise.resolve(searchCache[searchTerm]);
    }

    return fetch(`${searchUrl}${searchTerm}`)
        .then(response=> response.text())
        .then(body=>{
        const movies = [];
        const $ = cheerio.load(body);
        $('.findResult').each(function(i,element){
           const $element =$(element);
           const $image = $element.find('td a img');
           const $title = $element.find('td.result_text a');
           const imdbID  = $title.attr('href').match(/title\/(.*)\//)[1];


           const movie ={
               image:$image.attr('src'),
               title:$title.text(),
               imdbID
           };

           movies.push(movie);
        });

        return movies;
    })
}
function getMovie(imdbID){
    if(movieCache[imdbID]){
        console.log('serving for cache:',imdbID);
        return Promise.resolve(movieCache[imdbID]);
    }


    return fetch(`${movieUrl}${imdbID}`)
    .then(response=> response.text())
    .then(body=>{
        const $ = cheerio.load(body);
        const title = $('.title_wrapper h1')
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim();
        const contentRating = $('meta[itemProp="contentRating"]').attr('content');
        const duration = $('div.subtext time').text().trim();
        const genres = [];
        $('a span[itemProp="genre"]').each((i,element)=>{
            genres.push($(element).text());
        })
        const releaseDate = $('meta[itemProp="datePublished"]').attr('content');
        const rating = $('span[itemProp="ratingValue"]').text();
        const poster = $('div.poster a img').attr('src');
        const summery =$('div.summary_text').text().trim();
        const director = $('span[itemProp="director"] span[itemProp="name"]').text();
        const trailer =$('a[itemProp="trailer"]').attr('href')




        const movie= {
            imdbID,
            title,
            contentRating,
            duration,
            genres,
            releaseDate,
            rating,
            poster,
            summery,
            director,
            trailer:`https://www.imdb.com${trailer}`
        }
        movieCache[imdbID] = movie;
        return movie;
    });
}

module.exports = {
    searchMovies,
    getMovie
}