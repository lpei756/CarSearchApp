# CS719: Mid-Semester Assignment

In this assignment, you have been provided with a `car-data.js` file which contains an array of 220 car objects. 

Each car object within the array ; you contains the following properties:

- id

- carMake

- carModel

- carYear

- country

- price

- odometer

An individual car object looks something like this: 

`{ "id": 1, "carMake": "Chrysler", "carModel": "Grand Voyager", "carYear": 2000, "country": "Ukraine", "price": 35136, "odometer": 29585 }`

The `car-data.js` file has been imported into the main `app.js` configurations file and is accessible within the `app.js` file within the variable `carData` .

Your task is to make an application that will allow users to search for and view specific information from the car data within the web browser. You must design the server-side so that requests for car data based on each of the seven properties is requested by the browser/client via seven separate URL paths for each request.

## Marking schedule

The marks are broken down into 70 marks as follows:

- 20 marks for the user interface and client-side functionality

- 20 marks for server-side functionality

- 15 marks for the favourites functionality

- 15 marks for the summary statistics

## Requirements

### User interface (20 marks)

You are free to choose exactly what your page looks like. You must ensure that your page meets all of the functional requirements below:

- The user will interact with the application through the web browser
  
  - You will create any HTML, CSS and JavaScript required for the client-side code; you may use Handlebars if you want
  - You have been given a basic template with a Handlebars homepage; however, you may restructure the base template in any way you wish and you may use client-side HTML and JavaScript + AJAX if you wish

- The user should be able to search for cars based on any of the seven properties in the car object as specified below:
  
  - id: the user must be able to input a specific id and view the car matching that id
  
  - carMake: the user must be able to input a car make and view all cars matching that make
  
  - carModel: the user must be able to input a car model and view all cars matching that model
  
  - carYear: the user must be able to enter a range of years and view all cars within the range of years; for example, a user may want to see all cars from the years 1999-2009
  
  - country: the user must be able to input a country and view all cars from that country
  
  - price: the user must be able to enter a lower and upper range for the price and view all cars within that price range
  
  - odometer: the user must be able to enter a lower and upper range for the odometer and view all cars within that odometer range

- When the user selects one of the options to search for cars in the web interface; this will generate a request to the server that will then return the data for all matching cars and the web browser displays all data in the response from the server relating to each of the matching cars within the web browser 
  
  - You can choose how to display the data to the user; however, it should be displayed in the web page using appropriate HTML elements and in a format that is easy for the user to read and browse multiple cars and properties as required

- The user should be able to easily navigate between all options in the page and keep repeating new searches based on any of the seven properties above

- The page should only show the results of the most recent search

- You should use appropriate HTML elements for your interface; you should follow conventions for using things like HTML input elements and HTML forms where appropriate

- You may choose whether you use Handlebars, AJAX with client-side JavaScript or a combination of both to display the car data that has been requested by the user in the page

- You may choose whether you implement all of the required options to search and view data in the user interface in one page or across several pages; whichever way you implement it, the user should be able to easily navigate between the options of viewing cars they have searched for and generating new requests to search for and view more cars

- You will probably find that it is easiest to create seven separate HTML forms to generate the requests to the separate URL paths for requesting cars based on different properties; however, you may wish to investigate alternative 

- CSS and style will not be the main focus of this assignment; however, your page must be formatted to be usable on an average sized desktop screen; the user interface where users input data should be easy for a user to use and understand

### Server-side functionality and API (20 marks)

#### Url paths and API:

The server-side code must be structured to provide the web browser access to the car data through at least seven URL paths.

There should be at least one URL path for each of the seven properties of the car data; users will be able to generate requests to these URL paths from the web page/s they use and then view the data sent in the response. You may add more URL paths and route handler functions if you wish.

In the `app.js` file, you have been provided with an example function that gets car data by country name and an example route handler that calls this function and sends the JSON data back to the web browser; it is suggested that you look at these examples and test that you understand how they all work because that can help you if you get stuck.

You should structure your API through the use of route handler functions configured with appropriate HTTP methods, URL paths and parameters; for example, a route handler function to get car data via the URL `/cars/country` could be:

`app.get("/cars/country", function(req, res) {...}`

You should research "REST API URL naming conventions" and some general details about best practices for API design.  

Try to keep consistent naming conventions for all of the URL paths used in your API so that the URL path makes it reasonably clear what resource is being requested via that path. 

##### Tips for accessing the car data and sending the response

Within your route handler functions, you should access the car data and then send the appropriate response back to the web browser. The car data from `car-data.js` is referenced within the `app.js` file through the variable `carData`; the `require` keyword within `app.js` imports the data into the `app.js` module and the `export` keyword within the `car-data.js` file exports the data to be availble for other files. You can access the data within this array of objects as you would access the data within any array of objects in JavaScript; for example, you can loop through each object and check properties of each individual object.

You should try to write well defined functions within you `app.js` file to access the data from `car-data.js` required for generating responses to requests for each of the seven different properties of the car object as specified in the user interface requirements. For example, if a user requests cars within a certain price range, within the associated route handler for the URL path that requests that data, code should be executed to get the required data so it can be sent back to the browser. It is strongly suggested that you create appropriately named functions for getting the data that can be called from within your route handlers like the `getCarsByCountry(...)` example.

The specifics of how you send the response will depend on whether you're using Handlebars to render the data or whether you're sending the data as JSON as a response to AJAX requests that will then be added to the page through client-side JavaScript.

# Advanced features and functionality

## Selection of favourite cars (15 marks)

For this advanced feature, you must add the ability for the user to be able to select any car they can view in the browser and add that car's details to a list of favourite cars that will be stored client-side in the web browser. 

When viewing the cars, there should be a button or some other clickable option displayed with each individual car object that allows the user to click on any individual car to add that car to the favourites list that is stored client-side in the web browser. 

The list of car objects should be stored client-side in the web browser using `localStorage` from the  `Web Storage API` ; this will mean that if the user closes the browser or refreshes the page, cars that they have previously selected as favourites will still be stored there. This task requires you to do your own research to discover how to use the `Web Storage API` ; it is fairly easy to use with normal client-side JavaScript; data stored within `localStorage` with the `Web Storage API` can be stored in the normal format for JavaScript objects/arrays. You will just need to think through the logic of things like storing the data and handling button clicks in the interface.

These are the requirements for the favourites feature:

- A user should be able add any car they can view to the favourites list

- There should be an option added to the user interface in which the user can view all of their favourite cars

- A user should be able to remove cars from their favourites list by clicking an option in the interface

- A user shouldn't be able to add the same car to the favourites list twice; for example, the car with the id "1" should only be able to be added once

The favourites list is a client-side feature as the favourites will be stored in the web browser, so you will not need to use any server-side code for this feature; you will need to write client-side JavaScript for this feature

## Summary statistics (15 marks)

For this advanced feature, you will create the functionality for the user to be able to view two summary statistics from the array of car objects.

The user should be able to select and view these two summary statistics: 

- Users should be able to view the average price of all cars for a given year where the user is able to enter a given year and then view the average price for cars of that specific year and the count of how many cars there are for that given year

- Users should be able to view the count of all cars of a given make; a user should be able to enter a make of car (e.g., `Audi` ) and then view how many cars of that make there are and the average price for cars of that make

The summary statistics should not be displayed in all pages on the site by default; the user should be able to select the option to view the summary statistics in the interface which will then allow them to enter the inputs required to request the and view the summary statistics. The data for the summary statistics should be calculated on the server when the user selects this option and then displayed in the web browser when the user selects the option to view summary statistics; you should add any extra client-side or server-side code required for this feature. 

You may choose the specifics of how the summary statistics are displayed on the page.

The user should be able to navigate back to other parts of the web page from viewing the summary statistics. 