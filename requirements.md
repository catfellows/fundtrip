# Wire-Frame :
check ![link](https://github.com/catfellows/fundtrip/tree/master/Wireframe)
# User Story 
* As a user, I want to enter my budget and the place I want to travel to then click search
* As a user, I want to see all results in one page as a column separated.
* As a user, I want to add places to my collection
* As a user, I want to add places to my collection
* As a user, I want clear messages if something goes wrong so I know if I need to make any changes or try again in a different manner.
As a user, I want to see all reviews written by people about places.

# Software Requirements

## Vision
**Fundtrip** seamlessly connects millions of travelers to memorable experiences, a variety of transportation options, and incredible places to stay – from homes to hotels, and much more. As one of the world’s largest travel marketplaces for both established brands and entrepreneurs of all sizes, **Fundtrip** enables properties around the world to reach a global audience and grow their businesses.

## Scope (In/Out)

 ***IN***   
- This app will provide information about restaurants 
- This app will provide best hotel results.
- This app will give flight tickets with the most suitable budget.
-  The user can save favorite places in the database.

***OUt***
- We will not provide the user with an over budget travel plan

***MVP***
This app will provide the user with restourants, hotels and flight tickets suitable to user budget, user can add favorite places to collection and brows details about them. 

***Stretch***
- To make the origin location varry.

## Functional Requirements

- A user can search for a trip plane
- A user can add/remove places to collection.
- A user can choose any place from collection to get details.

## Non-Functional Requirements

* Insert data into database should be done within 2sec.
* Responce performense will be fast.
* This site should load in less than 3sec when the # of users are more than 10,000.

## Domain Modeling
* **location** : name, location_id, latitude, longetude, location_string, img and geo_description.
* **Restaurant** : name, latitude, longitude, num_reviews, rating, price_level, price, description, phone and address.
* **Hotels** : location_id, location_string, img, latitude, longitude, price_level, price and hotel_class.
* **Flight** : base_price, total, currency and grand_total.

# Entity Relationship Diagram
* **Favorite** => loaction_id(One to Many)
* **Location** => location_id(One to One)


## Tables
Favorite : 
1. id => serial primary key ;
2. location_id => int. ;
3. laitude => dec;
4. longitude => dec;
5. rating => dec;
6. description => varchar;
7. address => varchar;
8. phone => varchar;

## Location 
1. id => serial primary key ;
2. name => varchar;
3. laitude => dec;
4. longitude => dec;
5. img => varchar;
6. geo_description => varchar;
