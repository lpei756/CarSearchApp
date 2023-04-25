# Car Search App

The Car Search App is a simple web application based on Node.js and Express that allows users to search for car data and bookmark cars of interest. The client-side is handled using JavaScript and car data is fetched from the server using API requests.

## Features

- **Search functionality**: Allows users to filter cars by ID, make, model, country, year, price, and mileage.
- **Bookmark functionality**: Users can bookmark cars of interest for easy access later on.
- **Statistics functionality**: Displays the number of cars and average price in the current search results.

## Installation and Running

1. Make sure you have Node.js installed.
2. Clone this repository:
3. Install dependencies:
4. Run the application:

- Open your browser and visit http://localhost:3000 to view the application.

  I write with ajax. I use "/api/car-data" and only one path.

- When you click searchBtn , you can get car-data.
you can also chose different options.It depends on you.

- When you click heart shape svg, you can store the car in your favorites-list.

- when you click myFavoritesBtn, you can see your favorites-list in localStorage.

- when you click backsearchpageBtn at favorite-list page, you can back to search page.

- When you click heart shape svg in favorites-list, you can remove the car from it.

- When you click statisticsBtn, you can see from alert ‘There are ${numCars} cars.The average price for cars is ${avgPrice}.’ 

- The ${numCars} is how many cars in this page.

- The ${avgPrice} is the average price of all cars in this page.

- You can chose from carYear or carMake or any other options and statistics.

## Tech Stack

- Node.js
- Express
- JavaScript (Client-side)

## File Structure

- `app.js` - Contains the main logic of the application, defining routes and the API.
- `public/` - Contains static files such as HTML, CSS, and client-side JavaScript.
  - `site.html` - The main HTML file of the application.
  - `client.js` - Client-side JavaScript code that handles the user interface and API requests.
  - `style.css` - The stylesheet for the application.
- `car-data.js` - File or module containing car data.


## License

This project is licensed under the MIT License.
