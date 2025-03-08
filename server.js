const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

let movies = [];

app.get('/', (req, res) => {
    let filteredMovies = [...movies];

    // Filtering by Genre
    if (req.query.genre && req.query.genre !== "All") {
        filteredMovies = filteredMovies.filter(movie => movie.genre === req.query.genre);
    }

    // Sorting by Rating
    if (req.query.sort === "rating") {
        filteredMovies.sort((a, b) => b.rating - a.rating);
    }

    res.render('index', { movies: filteredMovies, selectedGenre: req.query.genre || "All" });
});

app.post('/add', (req, res) => {
    const { title, genre, year, rating } = req.body;
    const newMovie = { id: movies.length + 1, title, genre, year, rating, watched: false };
    movies.push(newMovie);
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    movies = movies.filter(movie => movie.id !== parseInt(req.params.id));
    res.redirect('/');
});

app.post('/update/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (movie) movie.watched = !movie.watched;
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
