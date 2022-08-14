// api.meteomatics.com/validdatetime/parameters/locations/format?optionals


var weatherLink = 'https://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&units=imperial&appid='
var apiKey = '9e35aa0fc6b3027ec345e09324b68148'
var requestUrl = weatherLink + apiKey

fetch(requestUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  console.log(data)
  
})