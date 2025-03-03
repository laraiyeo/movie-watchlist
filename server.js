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
    res.render('index', { movies });
});

app.post('/add', (req, res) => {
    const { title, genre, year, rating } = req.body;
    const newMovie = { id: movies.length + 1, title, genre, year, rating, watched: false };
    movies.push(newMovie);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
