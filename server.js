const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up Mustache as the template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Movie Data (Temporary)
let movies = [
    { id: 1, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8, watched: false },
    { id: 2, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0, watched: true }
];

// Routes
app.get('/', (req, res) => {
    res.render('index', { movies });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
