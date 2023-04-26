async function fetchCarData() {
    try {
        const response = await fetch('/api/car-data');
        return await response.json();
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
}

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

        const carInfoDiv = document.getElementById("carInfo");
        carInfoDiv.innerHTML = "";
        if (filteredCars.length === 0) {
            carInfoDiv.innerHTML = "<p>No car found with the given information.</p>";
        } else {
            fetch("/carTable.handlebars")
            .then(response => response.text())
            .then(template => {
                // Add the filtered car list to the cars array
                const context = { cars: filteredCars };
        
                // Use the Handlebars template engine to render the carTable.handlebars template
                const compiledTemplate = Handlebars.compile(template);
                const html = compiledTemplate(context);
        
                // Display the rendered result in the carInfo div
                carInfoDiv.innerHTML = html;
            });
        }
    }

function addSearchBtnListener() {
    const searchBtn = document.getElementById("searchBtn");
    searchBtn.addEventListener("click", (event) => searchBtnClicked(event));
}

let favorites = [];
function toggleFavorite(carId) {
    const heartBtn = document.getElementById(`heart-${carId}`);
    heartBtn.classList.toggle("red");
    heartBtn.classList.toggle("white");

    // Check if carId is in the favorites array
    const index = favorites.indexOf(carId);

    if (index === -1) {
        // carId is not in the array, add it to the favorites array
        favorites.push(carId);
    } else {
        // carId is in the array, remove it from the favorites array
        favorites.splice(index, 1);
    }
}

function showFavoritesPage() {
    const searchContainer = document.getElementById("search-container");
    const favoritesContainer = document.getElementById("favorites-container");
    
    searchContainer.style.display = "none";
    favoritesContainer.style.display = "block";
    
    updateFavoritesList();
}

async function updateFavoritesList() {
    const jsonData = await fetchCarData();
    const favoritesList = jsonData.filter(car => favorites.includes(car.id));
    
    const favoritesDiv = document.getElementById("favorites-list");
    favoritesDiv.innerHTML = "";
    
    if (favoritesList.length === 0) {
        favoritesDiv.innerHTML = "<p>No favorite cars added.</p>";
    } else {
        fetch("/carTable.handlebars")
        .then(response => response.text())
        .then(template => {
            const context = { cars: favoritesList };
            const compiledTemplate = Handlebars.compile(template);
            const html = compiledTemplate(context);

            favoritesDiv.innerHTML = html;
        });
    }
}

function showSearchPage() {
    const searchContainer = document.getElementById("search-container");
    const favoritesContainer = document.getElementById("favorites-container");

    searchContainer.style.display = "block";
    favoritesContainer.style.display = "none";
}

async function showStatistics() {
    const jsonData = await fetchCarData();
    const carCount = jsonData.length;
    const averagePrice = jsonData.reduce((sum, car) => sum + car.price, 0) / carCount;
    
    alert(`Total Cars: ${carCount}\nAverage Price: ${averagePrice.toFixed(2)}`);
}

async function showFavoriteStatistics() {
    const jsonData = await fetchCarData();
    const favoritesList = jsonData.filter(car => favorites.includes(car.id));
    
    const favoriteCarCount = favoritesList.length;
    const favoriteAveragePrice = favoritesList.reduce((sum, car) => sum + car.price, 0) / favoriteCarCount;
    
    alert(`Total Favorite Cars: ${favoriteCarCount}\nAverage Price of Favorites: ${favoriteAveragePrice.toFixed(2)}`);
}

function addStatisticsBtnListeners() {
    const statisticsBtn = document.getElementById("statisticsBtn");
    statisticsBtn.addEventListener("click", showStatistics);

    const favoritestatisticsBtn = document.getElementById("favoritestatisticsBtn");
    favoritestatisticsBtn.addEventListener("click", showFavoriteStatistics);
}


window.toggleFavorite = toggleFavorite;
window.onload = () => {
    populateCarIdSelect();
    populateCarMakeSelect();
    populateCarModelSelect();
    populatecountrySelect();
    addSearchBtnListener();
    addStatisticsBtnListeners();
};