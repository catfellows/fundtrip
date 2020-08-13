'use strict';
require('dotenv').config();

// Deefine the constant
const express = require('express');
const app = express();
const cors=require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const pg = require('pg');
app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);

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
app.post('/result',handelLocationresults);
app.post('/result',getcode);




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


function getFlightPrice(airPort,flightDate,adult) {
  let qs = {
    originLocationCode: 'AMM',
    destinationLocationCode: airPort,
    departureDate: flightDate ,
    adults: adult,
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

function getcode(req,res){
  let qs={
    query:req.body.place_name,
  }
  let url = "https://tripadvisor1.p.rapidapi.com/airports/search"
  return superagent.get(url).query(qs)
  .set('x-rapidapi-hos', `tripadvisor1.p.rapidapi.com`)
  .set('x-rapidapi-key', `dcb3f10824msh59a7cd80bb8b43ap1d2b6bjsn1628800ca361`)
  .set('useQueryString', true)
  .then(result=>{
    return result.body[0].code;
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
  this.name =  data.name;
  this.location_id = data.location_id;
  this.latitude = data.latitude;
  this.longitude = data.longitude;
  this.location_string = data.location_string;
  this.img=data.photo.images.original.url;
  this.geo_description = data.geo_description;
}

// Restarant

// Reviews

// Hotels

// Flight


app.listen(PORT, () => {
  console.log(`listening to port : ${PORT}`);
});
