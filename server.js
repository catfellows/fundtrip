'use strict';
require('dotenv').config();
const fs = require('fs');

// Deefine the constant
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
const methodOverride = require('method-override')
const PORT = process.env.PORT || 3000;

const pg = require('pg');
app.use(cors());
// const client = new pg.Client(process.env.DATABASE_URL);
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
});



app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));


// Route
app.get('/', handleHome);
app.get('/about', aboutUs);
app.get('/flight', getFlightPrice);
app.post('/result', getResults);
app.get("/contactUs", contact);
app.post('/contact-us', saveToMess);
app.get('/single', singleRestaurant);
app.get('/contact', contactUs);
app.post('/collection', saveToFav);
app.get('/collection', collection);
app.post('/testimonial', addReview);
app.post('/restRev', addRestRev);
app.delete('/delete', handelDelete);
app.get('/hotels', handelHotels);

app.get('/*', handleError);


// Handle function for the route
function contact(req, res) {
    res.render('pages/contact')
}

function aboutUs(req, res) {
    res.render('pages/about-us');
}

function contactUs(req, res) {
    res.render('pages/contact');
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
    let url = `https://travel-advisor.p.rapidapi.com/locations/search`;

    return superagent.get(url)
        .query(qs)
        .set('X-RapidAPI-Host', process.env.X_RAPIDAPI_HOS)
        .set('X-RapidAPI-Key', process.env.X_RAPIDAPI_KEY)
        .set('useQueryString', true)
        .then(locationReesult => {
            // console.log(locationReesult.body.data[0].result_object)

            return new Location(locationReesult.body.data[0].result_object)


        });
}

function handleHome(req, res) {

    (async () => {
        try {
            let review = await selectReview()
            res.render('./index', {
                list: review
            });
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

function handelHotels(id, dailyBudget, adult, day) {

    let qs = {

        offset: '0',

        pricesmax: dailyBudget,
        currency: 'USD',
        limit: '10',
        order: 'asc',
        lang: 'en_US',
        sort: 'price',

        location_id: id,
        adults: adult,
        checkin: '2022-12-15',
        rooms: '1',
        nights: day

    };

    let url = "https://travel-advisor.p.rapidapi.com/hotels/list";

    return superagent.get(encodeURI(url))
        .query(qs)
        .set('X-RapidAPI-Host', process.env.X_RAPIDAPI_HOS)
        .set('X-RapidAPI-Key', process.env.X_RAPIDAPI_KEY)
        .set('useQueryString', true)
        .then(hotelresults => {
            // console.log(hotelresults.body)
            return hotelresults.body.data.map(e => {
                return new Hotel(e);
            })
            // res.send(hotelresults.body)
            // res.send(hotel)
        });
}

function getResults(req, res) {
    let location_id = req.body.place_name;
    let budget = req.body.budget;
    let adult = req.body.adults;
    let data = req.body.travel_date.split('-');
    let day = calc(data[0], data[1]);

    (async () => {
        try {
            let location = await handelLocation(location_id);
            let code = await getcode(req.body.place_name);
            let flightToken = await getFlightToken();
            let flight = await getFlightPrice(code, adult, flightToken) || [];
            let dailyBudget = (Number(budget) - Number(flight && flight[0] && flight[0].grandTotal || 0)) / day;
            let restuarant = await getRestaurant(location.location_id, dailyBudget);
            let hotel = await handelHotels(location.location_id, dailyBudget, adult, day);
            // console.log(location)
            // res.send(hotel)
            res.render('./pages/search_result', {
                data: {
                    location,
                    restuarant,
                    flight,
                    hotel
                }
            });

        } catch (error) {
            console.error(error);
        }
    })();

    //   let restaurant = getRestaurant(location_id, '10951').then( returnedData => {
    //     return (returnedData);
    //   }).catch((err) => {
    //     console.log(err.message);
    //   });
}

function saveToFav(req, res) {
    let data = req.body;
    // let id = req.params.id;
    let SQL = 'INSERT INTO favorite(location_id, name,description,num_reviews,rating,price_level,phone,address,image,latitude,longitude,type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id';
    let array = [data.location_id, data.name, data.description, data.num_reviews, data.rating, data.price_level, data.phone, data.address, data.image, data.latitude, data.longitude, data.type];
    client.query(SQL, array).then(response => {
        // res.send(response);
        // res.render(`./pages/single/${response.rows[0].id}`);
        res.redirect(`/single?id=${response.rows[0].id}`)
    });
}

function getcode(req) {
    let qs = {
        query: req,
    }
    let url = "https://travel-advisor.p.rapidapi.com/airports/search"
    return superagent.get(url).query(qs)
        .set('X-RapidAPI-Host', process.env.X_RAPIDAPI_HOS)
        .set('X-RapidAPI-Key', process.env.X_RAPIDAPI_KEY)
        .set('useQueryString', true)
        .then(result => {
            return result.body[0].code;
        }).catch((err) => {
            //console.log(err.message);
        });
}

function getFlightToken() {
    const qs = {
        "grant_type": "client_credentials",
        "client_id": process.env.F_CLIENT_ID,
        "client_secret": process.env.F_CLIENT_KEY
    }
    return superagent.post('https://test.api.amadeus.com/v1/security/oauth2/token')
            .send(qs)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(res => {
                return res.body.access_token
            }).catch((err) => {
                console.log(err.message);
            });
}

function getFlightPrice(req, adult, token = '') {
    try {
        let qs = {
            originLocationCode: 'BKK',
            destinationLocationCode: req,
            departureDate: '2023-02-01',
            adults: adult,

        }

        console.log(token)
        
        let url = `https://test.api.amadeus.com/v2/shopping/flight-offers`;

        return superagent.get(url)
            .query(qs)
            .set('Authorization', `Bearer ${token}`)
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

    let price_level = '';

    if (prices_restaurants <= 100) {
        price_level = '10951';
    } else if (prices_restaurants <= 500) {
        price_level = '10953';
    } else {
        price_level = '10955';
    }

    // console.log('Pricee Level: ', price_level);
    let qs = {
        lunit: 'km',
        limit: '10',
        prices_restaurants: price_level,
        currency: 'USD',
        lang: 'en_US',
        location_id: location_id
    }

    let url = `https://travel-advisor.p.rapidapi.com/restaurants/list`;

    return superagent.get(encodeURI(url))
        .query(qs)
        .set('X-RapidAPI-Host', process.env.X_RAPIDAPI_HOS)
        .set('X-RapidAPI-Key', process.env.X_RAPIDAPI_KEY)
        .set('useQueryString', true)
        .then(restaurantResult => {
            return restaurantResult.body.data.map((e) => {
                return new Restaurant(e);
                // console.log(e.photo.images.original.url);
            });
        });
}

function singleRestaurant(req, res) {

    let id = req.query.id;
    let SQL = "SELECT * FROM favorite  WHERE id=$1 ";

    (async () => {
        try {
            let revData = await selectRestReview(id);
            let value = [id];
            client.query(SQL, value).then(data => {
                //res.send(revData)
                res.render('./pages/single_restaurant', {
                    result: data.rows[0],
                    reviewData: revData
                });
            });
        } catch (error) {
            console.error(error);
        }
    })();
}

function collection(req, res) {
    let SQL = 'select * from favorite;';
    client.query(SQL).then(results => {
        res.render('./pages/collection', {
            restuarant: results.rows
        });

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

    // console.log(req.body)

    return client.query(SQL, values)
        .then(() => {

            res.redirect(`/`)
        })
        .catch(error => {
            console.log(error);

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

    // console.log(req.body)

    return client.query(SQL, values)
        .then(() => {
            res.redirect('back')
        })
        .catch(error => {
            console.log(error);
        });
}

function saveToMess(req, res) {
    let data = req.body;
    let SQL = 'INSERT INTO messages(fname, email, message, subject ) VALUES ($1,$2,$#,$4)';
    let array = [data.fname, data.email, data.message, data.subject];
    client.query(SQL, array).then(response => {
        res.redirect('back');
    });
}

function selectReview() {
    let SQL = `select * from review`
    return client.query(SQL)
        .then((result) => {
            return (result.rows)
        })
}

function selectRestReview(id) {

    let SQL = `select * from reviewRest where idRest = ${id};`
    return client.query(SQL)
        .then((result) => {
            return (result.rows)
        })
}

function handelDelete(req, res) {

    let SQL = 'delete from favorite where id=$1;';
    let id = [req.query.id];
    // console.log(id)

    return client.query(SQL, id)
        .then(() => {

            res.redirect(`/collection`)
        })
        .catch(error => {
            close.log(error);
            res.render('pages/error');
        })
}

// Support function
function calc(date1, date2) {
    // console.log(date1, date2)
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
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
    this.type = 'flight';
    this.departure = 'AMM';
    // this.arrival = data.itineraries[0].segments[0].arrival.iataCode || '';
    this.arrival = data && data.itineraries[0] && data.itineraries[0].segments[0] && data.itineraries[0].segments[0].arrival && data.itineraries[0].segments[0].arrival.iataCode || '';
    this.numberOfBookableSeats = data.numberOfBookableSeats || 0;
    // this.date = data.itineraries[0].segments[0].departure.at.subString(0, 11) || '';
    this.date = data && data.itineraries[0] && data.itineraries[0].segments[0] && data.itineraries[0].segments[0].departure && data.itineraries[0].segments[0].departure.at || '';
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