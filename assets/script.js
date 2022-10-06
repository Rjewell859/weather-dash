// Selecting html elements

var cityEl = document.getElementById('city')
var submitEl = document.getElementById('submit')
var cityNameEl = document.getElementById('cityName')
var currentEl = document.getElementById('current')
var tempEl = document.getElementById('temp')
var windEl = document.getElementById('wind')
var humidityEl = document.getElementById('humidity')
var uviIndexEl = document.getElementById('aqi')
var forecastEl = document.getElementById('week')
var iconEl = document.getElementById('icon')
var historySection = document.getElementById('history')

// Storing parameters for use

var parameters = '&units=imperial&appid='

// Weekly forecast link

var weekWeatherLink = 'https://api.openweathermap.org/data/2.5/forecast?'

// API key for access

var apiKey = '9e35aa0fc6b3027ec345e09324b68148'

// Current weather link

var currentWeatherLink = 'https://api.openweathermap.org/data/2.5/weather?'

// UV Index link

var uviLink = 'https://api.openweathermap.org/data/2.5/onecall?'

// Parameters specific to uv index

var uvparameters = '&exclude=hourly,daily&appid='

// Array for storing history

var historyArray = []

// Storing current date

const today = '(' + moment(new Date()).format("MM/DD/YYYY") + ")"

// Gets the latitude and longitude of the requested city 
var getLatLon = function () {
  var searchLink = 'http://api.openweathermap.org/geo/1.0/direct?q='
  var selectedCity = cityEl.value;
  var searchParameters = '&limit=5&appid='
  var cityRequestUrl = searchLink + selectedCity + searchParameters + apiKey

  fetch(cityRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Saving latitude and longitute parameters in location for later use
      var latitude = (data[0].lat)
      var longitude = (data[0].lon)
      var latlon = [latitude, longitude];
      var location = 'lat=' + latlon[0] + '&lon=' + latlon[1];
      // Storing city and location in history
      setHistory(selectedCity, location)
    })


}
var getCurrentWeather = function (location) {
  iconEl.innerHTML = ''
  // Building request url
  var currentRequestUrl = currentWeatherLink + location + parameters + apiKey
  fetch(currentRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Setting weather icon data to retrieve image
      var icon = data.weather[0].icon
      var image = document.createElement('img');
      image.setAttribute('src', getIcon(icon));
      iconEl.append(image)

      // Populating the html with the current weather data
      cityNameEl.innerText = data.name + ' ' + today
      tempEl.innerText = 'Temp: ' + data.main.temp
      windEl.innerText = 'Wind: ' + data.wind.speed + ' MPH'
      humidityEl.innerText = 'Humidity: ' + data.main.humidity + '%'

    })
  // Getting UV Index 
  getUV(location)
  // Getting weather data for the weekly forecast
  getWeekWeather(location)
}
var getWeekWeather = function (location) {
  // Removes previously stored data from the forecast element
  forecastEl.innerHTML = ""
  // Building week request URL
  var weekRequestUrl = weekWeatherLink + location + parameters + apiKey

  fetch(weekRequestUrl).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Storing neccesary data in an array
      var responseArray = data.list
      // Setting heading
      var forcastHeading = document.createElement('h3')
      forcastHeading.innerHTML = '5 Day Forecast:'
      forcastHeading.setAttribute('class', 'card')
      forcastHeading.setAttribute('class', 'card-header')
      forecastEl.appendChild(forcastHeading)
      // Loop for building each of the 5 weather cards
      for (let i = 5; i <= 40; i += 8) {
        // Converting unix date for weather card to MM/DD/YYYY
        var unixDate = responseArray[i].dt_txt
        var convertedDate = '(' + moment(unixDate).format("MM/DD/YYYY") + ')'
        // Setting temp wind and humidity
        var temp = responseArray[i].main.temp
        var wind = responseArray[i].wind.speed + ' MPH'
        var humidity = responseArray[i].main.humidity + "%"
        // Setting icon with getIcon function
        var icon = responseArray[i].weather[0].icon
        var image = document.createElement('img');
        image.setAttribute('src', getIcon(icon));

        // Creating card and list item elements for data
        var weatherCard = document.createElement('div')
        var dateElement = document.createElement('li')
        var tempElement = document.createElement('li')
        var windElement = document.createElement('li')
        var humidityElement = document.createElement('li')

        // Setting id, classes, and styles
        weatherCard.setAttribute('id', 'weatherCard');
        weatherCard.setAttribute('class', 'card');
        dateElement.setAttribute('class', 'card-header');
        tempElement.setAttribute('class', 'list-group-item')
        windElement.setAttribute('class', 'list-group-item')
        humidityElement.setAttribute('class', 'list-group-item')
        tempElement.setAttribute('style', 'font-weight:bold')
        windElement.setAttribute('style', 'font-weight:bold')
        humidityElement.setAttribute('style', 'font-weight:bold')

        // Setting the elements inner text to their corresponding information
        dateElement.innerText = convertedDate;
        tempElement.innerText = 'Temp: ' + temp;
        windElement.innerText = 'Wind: ' + wind;
        humidityElement.innerText = 'Humidity: ' + humidity;
        // Appending to the card
        weatherCard.appendChild(dateElement);
        weatherCard.appendChild(image)
        weatherCard.appendChild(tempElement);
        weatherCard.appendChild(windElement);
        weatherCard.appendChild(humidityElement);
        // Appending weather card
        forecastEl.append(weatherCard);

      }
    })


}
var getIcon = function (icon) {
  // Uses weather.icon from weather search to retrieve icon with another request 
  var iconUrl = 'http://openweathermap.org/img/wn/' + icon + "@2x.png"
  return iconUrl
}
var getUV = function (location) {

  // UV Index request URL
  var uviRequestUrl = uviLink + location + uvparameters + apiKey
  // Fetch request for UV Index
  fetch(uviRequestUrl).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Setting elements inner text attribute to current UVI data
      uviIndexEl.innerText = 'UV Index: ' + data.current.uvi
    })
}


var setHistory = function (name, location) {
  // Keeps local storage list under 8 items long

  if (historyArray.length > 8) {
    historyArray.shift()
    localStorage.shift()
  }
  var historyObject = {
    title: name,
    location: location

  }
  // Stores history object in array
  historyArray.unshift(historyObject)
  // Setting local storage
  localStorage.setItem(name, location)

  // Creating and setting history element
  var historyEl = document.createElement('a')
  historyEl.innerHTML = historyObject.title;
  historyEl.setAttribute('href', '#/')
  historyEl.setAttribute('class', 'list-group-item')

  // Prepending history element
  historySection.prepend(historyEl);
  // Getting current weather for chosen location
  getCurrentWeather(location)
}

var loadHistory = function () {
  // Looping through local storage to get history objects
  for (var i = localStorage.length; i >= 0; i--) {
    let historyTitle = localStorage.key(i)
    let historyItem = localStorage.getItem(localStorage.key(i))

    // Creating anchor tag for storing the history
    let historyEl = document.createElement('a')
    // When clicked the application will call the functions to find the data for the selected city
    historyEl.onclick = function () {
      getCurrentWeather(historyItem)
    };
    historyEl.innerHTML = historyTitle;
    // Page does not refresh when clicking history element
    historyEl.setAttribute('href', '#/')
    historyEl.setAttribute('class', 'list-group-item')

    historySection.append(historyEl);
  }

}

loadHistory()