const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const movieGenres = [
    { id: 1, genre: 'horror' },
    { id: 2, genre: 'kids' },
    { id: 3, genre: 'magical' },
];

// GET
app.get('/api/vidly', (req, res) => {
    res.send(movieGenres);
});

// POST
app.post('/api/vidly', (req, res) => {
    const { error } = validateMovieGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movieGenre = {
        id: movieGenres.length + 1,
        genre: req.body.genre
    };
    movieGenres.push(movieGenre);
    res.send(movieGenre)
});

// PUT
app.put('/api/vidly/:id', (req, res) => {
    const movieGenre = movieGenres.find(g => g.id === parseInt(req.params.id));
    if (!movieGenre) {
        return res.status(404).send('The movie genre with the given ID was not found');
    }

    const { error } = validateMovieGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    movieGenre.genre = req.body.genre;
    res.send(movieGenre);
});

// DELETE
app.delete('/api/vidly/:id', (req, res) => {
    const movieGenre = movieGenres.find(g => g.id === parseInt(req.params.id));
    if (!movieGenre) {
        return res.status(404).send('The movie genre with the given ID was not found');
    }

    const index = movieGenres.indexOf(movieGenre);
    movieGenres.splice(index, 1);

    res.send(movieGenre);
});

function validateMovieGenre(movieGenre) {
    const schema = {
        genre: Joi.string().min(3).required()
    };

    return Joi.validate(movieGenre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
