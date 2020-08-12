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

app.get('/', handelHome);
app.get('/flight', getFlightPrice);

app.get('/*', handleError);

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

function getFlightPrice(req, res) {
  let Airplan = 'AMM';
  let qs = {
    originLocationCode: Airplan,
    destinationLocationCode: 'BKK',
    departureDate: '2021-02-01',
    adults: '1',
  }
  let url = `https://test.api.amadeus.com/v2/shopping/flight-offers`;

  superagent.get(encodeURI(url))
    .query(qs)
    .set('AUTHORIZATION', `Bearer 8dYSGMyBqvu9DpkH4ycBbxRqRRf6`)
    .then(locationReesult => {
      res.send(locationReesult.body.data[0].price.total);
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

// Flight


app.listen(PORT, () => {
  console.log(`listening to port : ${PORT}`);
});
