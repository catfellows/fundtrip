'use strict';
require('dotenv').config();

// Deefine the constant
const express = require('express');
const app = express();
const cors=require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
// const pg = require('pg');

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(cors());

app.use(express.urlencoded({
  extended: true
}));




app.use(express.urlencoded({
  extended: true
}));

app.get('/', handleHome);
app.get('/flight', getFlightPrice);
//app.post('/result', getResults);
app.post('/result',handelLocationresults);


app.get('/*', handleError);


function handelLocationresults(req,res){
  let locationName = req.body.place_name;

  handelLocation(locationName).then(returndata=>{
    
    res.send(returndata);
  });

}

function handelLocation(locationName) {
  
  let qs = {
    location_id: '1',
    limit: '1',
    sort: 'relevance',
    offset: '0',
    lang: 'en_US',
    currency: 'USD',
    units: 'km',
    query: locationName
  }
  let url = `https://tripadvisor1.p.rapidapi.com/locations/search`;

 return superagent.get(encodeURI(url))
    .query(qs)
    .set('x-rapidapi-hos', `tripadvisor1.p.rapidapi.com`)
    .set('x-rapidapi-key', `dcb3f10824msh59a7cd80bb8b43ap1d2b6bjsn1628800ca361`)
    .set('useQueryString', true)
    .then(locationReesult => {

      return new Location(locationReesult.body.data[0].result_object)

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

function getResults(req, res) {
  let location_id = req.body.place_name;

  (async () => {
    try {
        let result = await getRestaurant(location_id, '10951');
        let flight = await getFlightPrice('AMM');
        res.send({result, flight});
    } catch (error) {
        console.error(error);
    }
    })();

//   let restaurant = getRestaurant(location_id, '10951').then( returnedData => {
//     return (returnedData);
//   }).catch((err) => {
//     console.log(err.message);
//   });

//   res.send(result);
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


function getRestaurant(location_id, prices_restaurants) {
  let qs = {
    lunit: 'km',
    limit: '30',
    prices_restaurants: prices_restaurants,
    currency: 'USD',
    lang: 'en_US',
    location_id: location_id
  }

  let url = `https://tripadvisor1.p.rapidapi.com/restaurants/list`;

  return superagent.get(encodeURI(url))
    .query(qs)
    .set('x-rapidapi-hos', `tripadvisor1.p.rapidapi.com`)
    .set('x-rapidapi-key', `dcb3f10824msh59a7cd80bb8b43ap1d2b6bjsn1628800ca361`)
    .set('useQueryString', true)
    .then(restaurantResult => {
      return restaurantResult.body.data.map((e) => {
        return new Restaurant(e);
      });
    });
}


function handleError(err, res) {
  console.error(err);
//   res.render('pages/error', err);
}




// Constructors

// Location
function Location(data) {
  this.name =  data.name;
  this.location_id = data.location_id;
  this.latitude = data.latitude;
  this.longitude = data.longitude;
  this.location_string = data.location_string;
  this.img=data.photo.images.original.url;
  this.geo_description = data.geo_description;
}

// Restarant
function Restaurant(data) {
  this.name = data.name;
  this.latitude = data.latitude || '';
  this.longitude = data.longitude || '';
  this.num_reviews = data.num_reviews || '';
  this.rating = data.rating || '0.0';
  this.price_level = data.price_level || 'No level';
  this.price = data.price || '';
  this.description = data.description || '';
  this.phone = data.phone || '';
  this.address = data.address || '';
}

// Reviews

// Hotels

// Flight


app.listen(PORT, () => {
  console.log(`listening to port : ${PORT}`);
});
