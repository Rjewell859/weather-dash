// api.meteomatics.com/validdatetime/parameters/locations/format?optionals

var cityEl = document.getElementById('city')
var submitEl = document.getElementById('submit')
var cityNameEl = document.getElementById('cityName')
var currentEl = document.getElementById('current')
var tempEl = document.getElementById('temp')
var windEl = document.getElementById('wind')
var humidityEl = document.getElementById('humidity')
var aqiIndexEl = document.getElementById('aqi')
var forecastEl = document.getElementById('week')
var iconEl = document.getElementById('icon')
var historyEl = document.getElementById('history')

var parameters = '&units=imperial&appid='

var weekWeatherLink = 'https://api.openweathermap.org/data/2.5/forecast?'
var apiKey = '9e35aa0fc6b3027ec345e09324b68148'


var currentWeatherLink = 'https://api.openweathermap.org/data/2.5/weather?'

var aqiLink = 'http://api.openweathermap.org/data/2.5/air_pollution?'



const today = '(' + moment(new Date()).format("MM/DD/YYYY") + ")"


var getLatLon = function () {
  var searchLink = 'http://api.openweathermap.org/geo/1.0/direct?q='
  var selectedCity = cityEl.value;
  var searchParameters = '&limit=5&appid='
  var cityRequestUrl = searchLink + selectedCity + searchParameters + apiKey

  setHistory(selectedCity, cityRequestUrl)
  sendRequest(cityRequestUrl)
}
  var sendRequest = function(cityRequestUrl) {
    
  fetch(cityRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      var latitude = (data[0].lat)
      var longitude = (data[0].lon)
      var latlon = [latitude, longitude];
      var location = 'lat=' + latlon[0] + '&lon=' + latlon[1];
      getCurrentWeather(location)
     

    })


  }
var getCurrentWeather = function (location) {
  iconEl.innerHTML = ''

  var currentRequestUrl = currentWeatherLink + location + parameters + apiKey

  fetch(currentRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      console.log(data)
      var icon = data.weather[0].icon
      var image = document.createElement('img');
      image.setAttribute('src', getIcon(icon));
      iconEl.append(image)

      cityNameEl.innerText = data.name + ' ' + today
      tempEl.innerText = 'Temp: ' + data.main.temp
      windEl.innerText = 'Wind: ' + data.wind.speed + ' MPH'
      humidityEl.innerText = 'Humidity: ' + data.main.humidity + '%'

    })
    getWeekWeather(location)
}
var getWeekWeather = function (location) {

  forecastEl.innerHTML = ""

  var weekRequestUrl = weekWeatherLink + location + parameters + apiKey

  fetch(weekRequestUrl).then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log(data)
      var responseArray = data.list
      console.log(responseArray)
      for (let i = 0; i <40; i ++) {
        var unixDate = responseArray[i].dt_txt
        var convertedDate = '(' + moment(unixDate).format("MM/DD/YYYY HH:mm") + ')'
        console.log(convertedDate)
      }
      var forcastHeading = document.createElement('h3')
      forcastHeading.innerHTML = '5 Day Forecast:'
      forecastEl.appendChild(forcastHeading)
      for (let i = 5; i <= 40; i += 8) {
        var unixDate = responseArray[i].dt_txt
        var convertedDate = '(' + moment(unixDate).format("MM/DD/YYYY") + ')'
        var temp = responseArray[i].main.temp
        var wind = responseArray[i].wind.speed + ' MPH'
        var humidity = responseArray[i].main.humidity + "%"

        var icon = responseArray[i].weather[0].icon
        var image = document.createElement('img');
        image.setAttribute('src', getIcon(icon));

        var weatherCard = document.createElement('div')
        var dateElement = document.createElement('li')
        var tempElement = document.createElement('li')
        var windElement = document.createElement('li')
        var humidityElement = document.createElement('li')

        weatherCard.setAttribute('class', 'card');

        dateElement.innerText =  convertedDate;
        tempElement.innerText = 'Temp: ' + temp;
        windElement.innerText = 'Wind: ' + wind;
        humidityElement.innerText = 'Humidity: ' + humidity;

        weatherCard.appendChild(dateElement);
        weatherCard.appendChild(image)
        weatherCard.appendChild(tempElement);
        weatherCard.appendChild(windElement);
        weatherCard.appendChild(humidityElement);

        forecastEl.append(weatherCard);

      }
      

    })
    
    getAQI(location)

}
var getIcon = function(icon) {
  var iconUrl = 'http://openweathermap.org/img/wn/' + icon + "@2x.png"
  return iconUrl
}
var getAQI = function (location) {
  var aqiRequestUrl = aqiLink + location + parameters + apiKey
  fetch(aqiRequestUrl).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      var aqi = data.list[0].main.aqi
      var quality
      switch (aqi) {
        case 1:
          quality = 'Good';
          break;
        case 2:
          quality = 'Fair';
          break;
        case 3:
          quality = 'Moderate';
          break;
        case 4:
          quality = 'Poor';
          break;
        case 5:
          quality = 'Very Poor';
      }

      aqiIndexEl.innerText = 'Air Quality Index: ' + quality;

    })
}


var setHistory = function(name, url) {
  localStorage.setItem(name, url)
  var historyObject = document.createElement('a')
  historyObject.innerHTML = name;
  historyObject.setAttribute('data-url', url)
  historyObject.setAttribute('href', '#/')
  

  historyEl.append(historyObject);



}

var loadHistory = function() {

}

loadHistory()

