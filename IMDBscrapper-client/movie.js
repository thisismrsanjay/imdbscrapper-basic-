const main = document.querySelector('main');
const imdbID = window.location.search.match(/imdbID=(.*)/)[1];
const BASE_URL = 'https://imdb-sanjay.now.sh/';

function getMovie(imdbID){
    return fetch(`${BASE_URL}movie/${imdbID}`)
        .then(res=>res.json());
}
function showMovie(movie){
    console.log(movie);
    const section = document.createElement('section');
    main.appendChild(section);

    section.outerHTML= `
    <section class='row'>
        <h1 class="text-center">${movie.title}</h1>
        <div class="col-sm-12">
            <img src="${movie.poster}" class="img-responsive" />
        </div>
        <p>${JSON.stringify(movie)}</p>
    </section>
    `
}


getMovie(imdbID)
    .then(showMovie);