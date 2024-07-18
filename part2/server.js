const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const cities = require('./zipCodeModule_v2'); // Assuming zipCodeModule_v2.js exports necessary functions
const { create } = require('xmlbuilder2'); // Import xmlbuilder2 for XML creation

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars setup
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views'); // Ensure this points to the correct directory

// Static resources setup
app.use(express.static(__dirname + '/public'));

// GET request - Homepage
app.get('/', (req, res) => {
    res.render('homeView');
});

// GET request - /zip
app.get('/zip', (req, res) => {
    const { id } = req.query;
    if (id) {
        const data = cities.lookupByZipCode(id);
        if (data) {
            res.render('lookupByZipView', { data });
        } else {
            res.render('lookupByZipForm', { error: 'No results found for the provided zip code.' });
        }
    } else {
        res.render('lookupByZipForm');
    }
});

// POST request - /zip
app.post('/zip', (req, res) => {
    const { id } = req.body;
    const data = cities.lookupByZipCode(id);
    if (data) {
            res.render('lookupByZipView', { data });
        }
    else {
            res.render('lookupByZipForm', { error: 'No results found for the provided zip code.' });
        }
});

// GET request - /zip/:id
app.get('/zip/:id', (req, res) => {
    const { id } = req.params;
    const data = cities.lookupByZipCode(id);
    if (!data) {
        res.status(404).send('Zip code not found');
        return;
    }

    if (req.accepts('html')) {
        res.render('lookupByZipView', { data });
    } else if (req.accepts('json')) {
        res.json(data);
    } else if (req.accepts('xml')) {
        const xmlData = create({
            zipCode: {
                "@id": id,
                city: data.city,
                state: data.state,
                pop: data.pop
            }
        });
        res.type('application/xml');
        res.send(xmlData.toString());
    } else {
        res.status(406).send('Not Acceptable');
    }
});

// GET request - /city
app.get('/city', (req, res) => {
    const { city, state } = req.query;
    if (city && state) {
        const data = cities.lookupByCityState(city, state);
        if (data) {  
            res.render('lookupByCityStateView', { data } );
    } else {
        res.render('lookupByCityStateForm',  { error: 'No results found for the provided city and state.' });
    }
    } else {
    res.render('lookupByCityStateForm');
    }
   });

// POST request - /city
app.post('/city', (req, res) => {
    const { city, state } = req.body;
    const data = cities.lookupByCityState(city, state);
    if (data) {
        res.render('lookupByCityStateView', { data } );
    }
    else {
        res.render('lookupByCityStateView', { error: 'No results found for the provided city and state.' });
    }
    });


// GET request - /city/:city/state/:state
app.get('/city/:city/state/:state', (req, res) => {
    const { city, state } = req.params;
    const data = cities.lookupByCityState(city, state);
    if (!data) {
        res.status(404).send('City and state not found');
        return;
    }
    if (req.accepts('html')) {
        res.render('lookupByCityStateView', { data } );
    } else if (req.accepts('json')) {
        res.json(data);
    } else if (req.accepts('xml')) {
        const xmlData = create({
            "city-state": {
                "@city": city,
                "@state": state,
                entry: data.data.map(entry => ({
                    "@zip": entry.zip,
                    "@pop": entry.pop
                }))
            }
        });
        res.type('application/xml');
        res.send(xmlData.toString());
    } else {
        res.status(406).send('Not Acceptable');
    }
});
// GET request - /pop
app.get('/pop', (req, res) => {
    const { state } = req.query;
    if (state) {
        const data = cities.getPopulationByState(state);
        if (data) {
                res.render('populationView', { data });
            } else {
                res.render('populationForm', { error: 'No population data available for the provided state.' });
            } 
        }else {
        res.render('populationForm');
    }});
// GET request - /pop/:state
app.get('/pop/:state', (req, res) => {
    const { state } = req.params;
    const data = cities.getPopulationByState(state);


    if (req.accepts('html')) {
        res.render('populationView', { data });
    } else if (req.accepts('json')) {
        res.json(data);
    } else if (req.accepts('xml')) {
        const { create } = require('xmlbuilder2');
        const xmlData = create({
            "state-pop": {
                "@state": state,
                pop: data.pop
            }
        });
        res.type('application/xml');
        res.send(xmlData.end({ prettyPrint: true }));
    } else {
        res.status(406).send('Not Acceptable');
    }
});
// 404 Error handling
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});