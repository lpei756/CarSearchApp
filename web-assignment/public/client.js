async function fetchCarData() {
    try {
        const response = await fetch('/api/car-data');
        return await response.json();
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
}

// -----------------------------//

async function populateCarIdSelect() {
    const jsonData = await fetchCarData();

    const idSelect = document.getElementById("idSelect");
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Choose an ID";
    idSelect.appendChild(emptyOption);

    jsonData.forEach(car => {
        const option = document.createElement("option");
        option.value = car.id;
        option.textContent = car.id;
        idSelect.appendChild(option);
    });
}

async function populateCarMakeSelect() {
    const jsonData = await fetchCarData();

    const makeSelect = document.getElementById("makeSelect");

    // remove existing options
    makeSelect.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Choose a carMake";
    makeSelect.appendChild(emptyOption);

    const carMakes = Array.from(new Set(jsonData.map(car => car.carMake))).sort();

    carMakes.forEach(make => {
        const option = document.createElement("option");
        option.value = make;
        option.textContent = make;
        makeSelect.appendChild(option);
    });

    // add event listener to update modelSelect options
    makeSelect.addEventListener("change", () => {
        const selectedMake = makeSelect.value;
        populateCarModelSelect(selectedMake);
    });
}

async function populateCarModelSelect(selectedMake) {
    const jsonData = await fetchCarData();

    const modelSelect = document.getElementById("modelSelect");

    // remove existing options
    modelSelect.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Choose a carModel";
    modelSelect.appendChild(emptyOption);

    const carModels = Array.from(new Set(jsonData.filter(car => car.carMake === selectedMake).map(car => car.carModel))).sort();

    carModels.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
}

async function populatecountrySelect() {
    const jsonData = await fetchCarData();

    const countrySelect = document.getElementById("countrySelect");
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Choose a country";
    countrySelect.appendChild(emptyOption);

    const country = Array.from(new Set(jsonData.map(car => car.country))).sort();

    country.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}


async function searchBtnClicked(event) {
    event.preventDefault();

    const jsonData = await fetchCarData();

    const idSelect = document.getElementById("idSelect");
    const makeSelect = document.getElementById("makeSelect");
    const modelSelect = document.getElementById("modelSelect");
    const countrySelect = document.getElementById("countrySelect");

    const minYear = parseInt(document.getElementById("minYear").value);
    const maxYear = parseInt(document.getElementById("maxYear").value);
    const minPrice = parseInt(document.getElementById("minPrice").value);
    const maxPrice = parseInt(document.getElementById("maxPrice").value);
    const minOdometer = parseInt(document.getElementById("minOdometer").value);
    const maxOdometer = parseInt(document.getElementById("maxOdometer").value);

    const id = idSelect.value ? parseInt(idSelect.value) : null;
    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;
    const selectedCountry = countrySelect.value;

    const filteredCars = jsonData.filter(car => {
        const matchId = !id || car.id === id;
        const matchMake = !selectedMake || car.carMake === selectedMake;
        const matchModel = !selectedModel || car.carModel === selectedModel;
        const matchCountry = !selectedCountry || car.country === selectedCountry;

        const matchYear = (!minYear && !maxYear) || (car.carYear >= minYear && car.carYear <= maxYear)
        const matchPrice = (!minPrice && !maxPrice) || (car.price >= minPrice && car.price <= maxPrice)
        const matchOdometer = (!minOdometer && !maxOdometer) || (car.odometer >= minOdometer && car.odometer <= maxOdometer)

        return matchId && matchMake && matchModel && matchCountry && matchYear && matchPrice && matchOdometer;
    });

    if (filteredCars.length > 0) {
        renderCarTable(filteredCars);
    } else {
        const carInfoDiv = document.getElementById("carInfo");
        carInfoDiv.innerHTML = '<p>No car found with the given information.</p>';
    }
}

function addSearchBtnListener() {
    const searchBtn = document.getElementById("searchBtn");
    searchBtn.addEventListener("click", (event) => searchBtnClicked(event));
}

function renderCarTable(carData) {
    fetch("/carTable.handlebars")
        .then((response) => response.text())
        .then((carTableTemplate) => {
            const template = Handlebars.compile(carTableTemplate);
            const renderedTable = template({ cars: carData });
            const carInfoDiv = document.getElementById("carInfo");
            carInfoDiv.innerHTML = renderedTable;
        });
}

async function addToFavorites(car) {
    const favoritesList = document.getElementById("favorites-list");

    // Check if car is already in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isDuplicate = favorites.some(favorite => favorite.id === car.id);
    if (isDuplicate) {
        alert("This car is already in your favorites list.");
        return;
    }

    // Fetch and compile the Handlebars template
    const response = await fetch('/views/favorites.handlebars');
    const templateText = await response.text();
    const template = Handlebars.compile(templateText);

    // Render the template with the car data
    const carHtml = template({ cars: [car] });

    // Create a new div and set the innerHTML
    const carDiv = document.createElement("div");
    carDiv.innerHTML = carHtml;
    carDiv.setAttribute("data-car-id", car.id);

    // Append the div to the favorites list
    favoritesList.appendChild(carDiv);

    // Save the car to localStorage
    const updatedFavorites = [...favorites, car];
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}




function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesList = document.getElementById("favorites-list");
    favorites.forEach(car => {
        const carData = JSON.parse(localStorage.getItem(`car-${car.id}`));
        if (carData) {
            const carDiv = document.createElement("div");
            carDiv.innerHTML = carData.html;
            carDiv.setAttribute("data-car-id", car.id);
            favoritesList.appendChild(carDiv);

            const favoriteCheckbox = carDiv.querySelector(`#favorite-${car.id}`);
            favoriteCheckbox.checked = carData.isChecked;
            favoriteCheckbox.addEventListener("change", () => {
                const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                const isFavorite = favorites.some(favorite => favorite.id === car.id);
                if (favoriteCheckbox.checked && !isFavorite) {
                    addToFavorites(car);
                } else {
                    removeFromFavorites(car.id);
                }
            });
        }
    });
}

function removeFromFavorites(carId) {
    const favoritesList = document.getElementById("favorites-list");
    const listItemToRemove = favoritesList.querySelector(`[data-car-id="${carId}"]`);
    if (listItemToRemove) {
        favoritesList.removeChild(listItemToRemove);
    }

    // Remove the car from localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = favorites.filter(car => car.id !== carId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    localStorage.removeItem(`car-${carId}`);
}

function toggleFavorites() {
    const favoritesContainer = document.getElementById("favorites-container");
    const searchContainer = document.getElementById("search-container");

    favoritesContainer.style.display = "block";
    searchContainer.style.display = "none";
}

async function statisticsBtnClicked(event) {
    event.preventDefault();

    const carInfo = document.getElementById("carInfo");
    const cars = carInfo.children;

    const numCars = cars.length;
    const totalPrice = Array.from(cars).reduce((acc, car) => {
        const priceStr = car.querySelector('p:nth-of-type(6)').textContent;
        const price = parseInt(priceStr.split(':')[1].trim());
        return acc + price;
    }, 0);
    const avgPrice = Math.round(totalPrice / numCars);

    alert(`There are ${numCars} cars.\nThe average price for cars is ${avgPrice}.`);
}

async function favoritestatisticsBtnClicked(event) {
    event.preventDefault();

    const favoriteslist = document.getElementById("favorites-list");
    const cars = favoriteslist.children;

    const numCars = cars.length;
    const totalPrice = Array.from(cars).reduce((acc, car) => {
        const priceStr = car.querySelector('p:nth-of-type(6)').textContent;
        const price = parseInt(priceStr.split(':')[1].trim());
        return acc + price;
    }, 0);
    const avgPrice = Math.round(totalPrice / numCars);

    alert(`There are ${numCars} cars.\nThe average price for cars is ${avgPrice}.`);
}

function backToSearch() {
    const favoritesContainer = document.getElementById("favorites-container");
    const searchContainer = document.getElementById("search-container");

    favoritesContainer.style.display = "none";
    searchContainer.style.display = "block";
}

function addEventListeners() {
    document.getElementById("searchBtn").addEventListener("click", searchBtnClicked);
    document.getElementById("favoritesBtn").addEventListener("click", toggleFavorites);
    document.getElementById("backBtn").addEventListener("click", backToSearch);
    document.getElementById("statisticsBtn").addEventListener("click", statisticsBtnClicked);
    document.getElementById("favoritestatisticsBtn").addEventListener("click", favoritestatisticsBtnClicked);
}

window.onload = () => {
    populateCarIdSelect();
    populateCarMakeSelect();
    populateCarModelSelect();
    populatecountrySelect();
    addEventListeners();
    loadFavorites();
};
