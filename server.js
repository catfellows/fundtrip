'use strict';
require('dotenv').config();

// Deefine the constant
const express = require('express');
const app = express();
const superagent = require('superagent')
const PORT = process.env.PORT || 3000;
const pg = require('pg');

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', handleHome);
app.get('/flight', getFlightPrice);

app.get('/hotels', handelHotels);

app.get('/*', handleError);

app.use(express.urlencoded({
    extended: true
}));

function handelHotels(req, res) {
    let qs = {
        qs: {
            offset: '0',
            pricesmax: '100',
            currency: 'USD',
            limit: '5',
            order: 'asc',
            lang: 'en_US',
            sort: 'price',
            location_id: '293986',
            adults: '1',
            checkin: '2020-12-15',
            rooms: '1',
            nights: '10'
        },
    }
    let url = `https://tripadvisor1.p.rapidapi.com/locations/search`;
    superagent.get(encodeURI(url))
        .query(qs)
        .set('x-rapidapi-hos', `tripadvisor1.p.rapidapi.com`)
        .set('x-rapidapi-key', `dcb3f10824msh59a7cd80bb8b43ap1d2b6bjsn1628800ca361`)
        .set('useQueryString', true)
        .then(locationReesult => {
            res.send(locationReesult.body.data[0].result_object);
        });
}


function handelHome(req, res) {
    let locationName = 'Amman';
    let qs = {
        location_id: '1',
        limit: '10',
        sort: 'relevance',
        offset: '0',
        lang: 'en_US',
        currency: 'USD',
        units: 'km',
        query: locationName
    }
    let url = `https://tripadvisor1.p.rapidapi.com/locations/search`;

    superagent.get(encodeURI(url))
        .query(qs)
        .set('x-rapidapi-hos', `tripadvisor1.p.rapidapi.com`)
        .set('x-rapidapi-key', `dcb3f10824msh59a7cd80bb8b43ap1d2b6bjsn1628800ca361`)
        .set('useQueryString', true)
        .then(locationReesult => {
            res.send(locationReesult.body.data[0].result_object);
        });
}

function handleHome(req, res) {
    res.render('./index.ejs');
    //   getFlightPrice('AMM').then( returnedData => {
    //     res.send(returnedData);
    //   }).catch((err) => {
    //     console.log(err.message);
    //   });
}


function getFlightPrice(airPort) {
    let qs = {
        originLocationCode: airPort,
        destinationLocationCode: 'BKK',
        departureDate: '2021-02-01',
        adults: '1',
    }
    let url = `https://test.api.amadeus.com/v2/shopping/flight-offers`;

    return superagent.get(encodeURI(url))
        .query(qs)
        .set('AUTHORIZATION', `Bearer ${process.env.FLIGHT_API_KEY}`)
        .then(locationReesult => {
            return locationReesult.body.data[0].price.total;
        }).catch((err) => {
            console.log(err.message);
        });
}

function handleError(err, res) {
    console.error(err);
    //   res.render('pages/error', err);
}


// Constructors

// Location
function Location(data) {
    this.name = data;
    this.location_id = data.location_id;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.location_string = data.location_string;
    this.geo_description = data.geo_description;
}

// Restarant

// Reviews

// Hotels
function Hotel(data) {
    this.location = data.location_id;
    this.locationName = data.location_string;
    this.latitude = data.latitude || '';
    this.longitude = data.longitude || '';
    this.num_reviews = data.num_reviews || '';
    this.ranking = data.ranking || '0.0';
    this.rating = data.rating || 'No level';
    this.price = data.price || '';
    this.price_level = data.price_level || '';
    this.subcategory_type_label = subcategory_type_label || '';
    this.photo = data.photo.images.large.url || '';
}
// Flight


app.listen(PORT, () => {
    console.log(`listening to port : ${PORT}`);
});