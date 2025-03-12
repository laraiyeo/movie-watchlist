// Import required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
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

// Database setup
const db = new sqlite3.Database('./movies.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Create Movies table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT,
    year INTEGER,
    rating REAL,
    watched BOOLEAN DEFAULT 0
)`);

// Fetch movies, filtering & sorting
app.get('/', (req, res) => {
    let query = "SELECT * FROM movies";
    const params = [];

    if (req.query.genre && req.query.genre !== "All") {
        query += " WHERE genre = ?";
        params.push(req.query.genre);
    }

    if (req.query.sort === "rating") {
        query += " ORDER BY rating DESC";
    }

    db.all(query, params, (err, movies) => {
        if (err) return res.status(500).send("Database error.");

        db.all("SELECT DISTINCT genre FROM movies", [], (err, genres) => {
            if (err) return res.status(500).send("Database error.");

            res.render("index", {
                movies,
                genres: genres.map(g => g.genre),
                selectedGenre: req.query.genre || "All"
            });
        });
    });
});

// Add a new movie
app.post('/add', (req, res) => {
    const { title, genre, year, rating } = req.body;
    db.run('INSERT INTO movies (title, genre, year, rating, watched) VALUES (?, ?, ?, ?, ?)',
        [title, genre, year, rating, 0], (err) => {
            if (err) console.error(err.message);
            res.redirect('/');
        });
});

// Toggle watched status
app.post('/update/:id', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE movies SET watched = NOT watched WHERE id = ?', [id], (err) => {
        if (err) console.error(err.message);
        res.json({ success: true }); // Send JSON response instead of redirect
    });
});


// Update a movie (Fix Edit Functionality)
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { title, genre, year, rating } = req.body;

    db.run('UPDATE movies SET title = ?, genre = ?, year = ?, rating = ? WHERE id = ?',
        [title, genre, year, rating, id], (err) => {
            if (err) console.error(err.message);
            res.redirect('/');
        });
});

// Delete a movie
app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM movies WHERE id = ?', [id], (err) => {
        if (err) console.error(err.message);
        res.redirect('/');
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
