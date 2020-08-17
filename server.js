'use strict';
require('dotenv').config();

// Deefine the constant
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

const pg = require('pg');
app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);


app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: true
}));


app.get('/', handleHome);
app.get('/about', aboutUs)
app.get('/flight', getFlightPrice);
//app.post('/result', getResults);
app.post('/result', getResults);


app.get('/single', singleRestaurant);
app.post('/collection', saveToFav);
app.get('/collection', collection);
app.post('/testimonial', addReview)
    // app.get('/',selectReview)

app.get('/hotels', handelHotels);


app.get('/*', handleError);

function handelHotels(id) {

    let qs = {

        offset: '0',
        pricesmax: '1000',
        currency: 'USD',
        limit: '5',
        order: 'asc',
        lang: 'en_US',
        sort: 'price',
        location_id: id,
        adults: '1',
        checkin: '2020-12-15',
        rooms: '1',
        nights: '10'

    };

    let url = "https://tripadvisor1.p.rapidapi.com/hotels/list";
    return superagent.get(encodeURI(url))
        .query(qs)
        .set('x-rapidapi-hos', `tripadvisor1.p.rapidapi.com`)
        .set('x-rapidapi-key', `17b4c35337mshcca2a4e363e9166p1b9820jsnfac672d7cc8d`)
        .set('useQueryString', true)
        .then(hotelresults => {
            return hotelresults.body.data.map(e => {
                    return new Hotel(e);
                })
                // res.send(hotelresults.body)
                // res.send(hotel)

        });
}


function aboutUs(req, res) {
    res.render('pages/about-us')
}

function handelLocationresults(req, res) {
    let locationName = req.body.place_name;

    handelLocation(locationName).then(returndata => {

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
        .set('x-rapidapi-hos', process.env.X_RAPIDAPI_HOS)
        .set('x-rapidapi-key', process.env.X_RAPIDAPI_KEY)
        .set('useQueryString', true)
        .then(locationReesult => {

            return new Location(locationReesult.body.data[0].result_object)


        });
}

function handleHome(req, res) {

    (async() => {
        try {
            let review = await selectReview()
            res.render('./index', { list: review });
        } catch (error) {
            console.error(error);
        }
    })();
    //   getFlightPrice('AMM').then( returnedData => {
    //     res.send(returnedData);
    //   }).catch((err) => {
    //     console.log(err.message);
    //   });
}

function getResults(req, res) {
    let location_id = req.body.place_name;
    let budget = req.body.budget;
    (async() => {
        try {
            let location = await handelLocation(location_id);
            let code = await getcode(req.body.place_name);
            let flight = await getFlightPrice(code);
            let dailyBudget = (budget - flight) / 10;
            let restuarant = await getRestaurant(location.location_id, '10951');
            let hotel = await handelHotels(location.location_id);
            console.log(hotel)
            res.render('./pages/search_result', { data: { location, restuarant, flight, hotel } });

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

function saveToFav(req, res) {
    let data = req.body;
    // let id = req.params.id;
    let SQL = 'INSERT INTO favorite(location_id, name,description,num_reviews,rating,price_level,phone,address,image,latitude,longitude,type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id'
    let array = [data.location_id, data.name, data.description, data.num_reviews, data.rating, data.price_level, data.phone, data.address, data.image, data.latitude, data.longitude, data.type];
    client.query(SQL, array).then(response => {
        // res.render(`./pages/single/${response.rows[0].id}`);
        res.redirect(`/single?id=${response.rows[0].id}`)
    })
}



function getcode(req) {
    let qs = {
        query: req,
    }
    let url = "https://tripadvisor1.p.rapidapi.com/airports/search"
    return superagent.get(url).query(qs)
        .set('x-rapidapi-hos', process.env.X_RAPIDAPI_HOS)
        .set('x-rapidapi-key', process.env.X_RAPIDAPI_KEY)
        .set('useQueryString', true)
        .then(result => {
            return result.body[0].code;
        }).catch((err) => {
            //console.log(err.message);
        });
}

function getFlightPrice(req) {
    try {
        let qs = {
            originLocationCode: 'BKK',
            destinationLocationCode: req,
            departureDate: '2021-02-01',
            adults: 1,
        }

        //  console.log('getFlightPrice ', req);
        let url = `https://test.api.amadeus.com/v2/shopping/flight-offers`;

        return superagent.get(encodeURI(url))
            .query(qs)
            .set('AUTHORIZATION', `Bearer ${process.env.FLIGHT_API_KEY}`)
            .then(locationReesult => {
                return locationReesult.body.data.map(element => {
                    return new Flight(element)
                });
            }).catch((err) => {
                console.log(err.message);
            });
    } catch (err) {
        //console.log(err)
    }
}


function getRestaurant(location_id, prices_restaurants) {
    let qs = {
        lunit: 'km',
        limit: '10',
        prices_restaurants: prices_restaurants,
        currency: 'USD',
        lang: 'en_US',
        location_id: location_id
    }

    let url = `https://tripadvisor1.p.rapidapi.com/restaurants/list`;

    return superagent.get(encodeURI(url))
        .query(qs)
        .set('x-rapidapi-hos', process.env.X_RAPIDAPI_HOS)
        .set('x-rapidapi-key', process.env.X_RAPIDAPI_KEY)
        .set('useQueryString', true)
        .then(restaurantResult => {
            return restaurantResult.body.data.map((e) => {
                return new Restaurant(e);
                // console.log(e.photo.images.original.url);
            });
        });
}

function singleRestaurant(req, res) {


    let SQL = "SELECT * FROM favorite  WHERE id=$1 ";
    let value = [req.query.id];
    client.query(SQL, value).then(data => {
        // res.send(data)
        res.render('./pages/single_restaurant', { result: data.rows[0] });

    })
}

function collection(req, res) {
    let SQL = 'select * from favorite;';
    client.query(SQL).then(results => {
        res.render('./pages/collection', { restuarant: results.rows });

    })
}

function handleError(err, res) {
    console.error(err);
    res.render('error');
}



function addReview(req, res) {

    let SQL = 'INSERT INTO review (name ,review) VALUES ($1,$2);'
    let $1 = req.body.fullname;
    let $2 = req.body.reviewe;
    let values = [$1, $2];

    console.log(req.body)

    return client.query(SQL, values)
        .then(() => {

            res.redirect(`/`)
        })
        .catch(error => {
            close.log(error);

        })


}

function addRestRev(req, res) {
    let SQL = 'INSERT INTO reviewRest (score, email, name, review ,idRest) VALUES ($1,$2,$3,$4,$5);'
    let $1 = req.body.rgcl;
    let $2 = req.body.email;
    let $3 = req.body.name;
    let $4 = req.body.review;
    let $5 = req.query.id;

    let values = [$1, $2, $3, $4, $5];

    console.log(req.body)

    return client.query(SQL, values)
        .then(() => {

            res.redirect('back')
        })
        .catch(error => {
            close.log(error);

        })
}


function selectReview() {

    let SQL = 'select * from review;'

    return client.query(SQL)
        .then((result) => {
            return (result.rows)

        })

}

function selectRestReview() {

    let SQL = 'select * from reviewRest;'

    return client.query(SQL)
        .then((result) => {
            return (result.rows)

        })

}




// Constructors

// Location
function Location(data) {
    this.name = data.name;
    this.location_id = data.location_id;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.location_string = data.location_string;
    this.img = data.photo.images.original.url;
    this.geo_description = data.geo_description;
}

// Restarant
function Restaurant(data) {
    this.type = 'restaurant';
    this.name = data.name || 'No name';
    this.latitude = data.latitude || '11';
    this.longitude = data.longitude || '11';
    this.num_reviews = data.num_reviews || '0';
    this.rating = data.rating || '0.0';
    this.price_level = data.price_level || 'No level';
    this.price = data.price || '-';
    this.description = data.description || 'No description available';
    this.phone = data.phone || 'No phone';
    this.address = data.address || 'No address';
    this.image = data && data.photo && data.photo.images && data.photo.images.original.url || 'https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png';
}

// Reviews

// Hotels
function Hotel(data) {
    this.location = data.location_id;
    this.name = data.name
    this.locationName = data.location_string;
    this.latitude = data.latitude || '';
    this.longitude = data.longitude || '';
    this.num_reviews = data.num_reviews || '';
    this.ranking = data.ranking || '0.0';
    this.rating = data.rating || 'No level';
    this.price = data.price || '';
    this.price_level = data.price_level || '';
    this.subcategory_type_label = data.subcategory_type_label || '';
    this.photo = data && data.photo && data.photo.images && data.photo.images.original.url || 'https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png';
}
// Flight
function Flight(data) {
    this.type = 'flight'
    this.departure = 'AMM',
        this.arrival = data.itineraries.segments.arrival.iataCode || '',
        this.date = data.itineraries.segments.departure.at.subString(0, 11) || '',
        this.base = data.price.base || '';
    this.total = data.price.total || '';
    this.currency = data.price.currency || '';
    this.grandTotal = data.price.grandTotal || '';
}
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listening to port : ${PORT}`);
    });
})