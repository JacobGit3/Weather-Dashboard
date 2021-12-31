// Global Variables
let date = moment().format('L');
const SaveCityKey = 'City';
const APIkey = '5a84980c7b7b783f90dce101ba33a6f6';


// Get the weather for the desired City
function weather(cityName) {
  // Make sure there is a city name
  if (cityName === ''){
    console.log('No city inputted');
    return;
  }
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + APIkey)
  // Convert data to json
  .then(function(resp) { return resp.json() })
  .then(function(data) {
    if (data.cod == '404') {
      cityName.value = 'Invalid City';
      let cityName = document.getElementById('city');
    }else {
      loadForecast(data);
      saveCity(cityName);
      UV_Title(data, cityName);
    }
  })
  // Catch errors
  .catch(function() {
    console.log('ERROR');
  });
}

// Get and create UV index, also adds city name to title
function UV_Title(data, cityName){
  // Change city name in title
  document.getElementById('yourCity').innerHTML = cityName;
  // Get longitude and latitude from UV api
  let latitude = data.city.coord.lat;
  let longitude = data.city.coord.lon;
  let UV_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${APIkey}`;
  return fetch(UV_URL)
    .then(response => response.json())
    .then(UVData => {
      // Get UV index and run function to add UV index and colour it
      let UVIndex = UVData.current.uvi;
      UVColor(UVIndex);
    })
}

// Add and change the background color of the UV div
function UVColor(UVIndex){
  // Check UV Index and change colour based on severity
  let severity = '';
  if (UVIndex < 2) {
    severity = 'low';
  }else if ((UVIndex >= 2) & (UVIndex < 5)) {
    severity = 'medium';
  }else {
    severity = 'high';
  }
  let UVDiv = document.getElementById('UVIndex');
  UVDiv.innerHTML = (`Current UV: ${UVIndex}`); 
  UVDiv.classList.add(`${severity}`);
}

// Create the Daily Forecast divs 
function loadForecast(data) {
  // Create divs if none
  if ( $('#forecast').children().length == 0 ){
    for (let i=0; i<6; i++){
      let day = moment().add(i, 'days').format('L');
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
      $('#forecast').append(`<div class='dailyForecast' id='forecast${i}'></div>`);
      $(`#forecast${i}`).append(`<h3 class='forecastDate' id='date${i}'>${day}</h3>`);
      $(`#forecast${i}`).append(`<image class='forecastIcon' id='icon${i}' src='${icon}'></image>`);
      $(`#forecast${i}`).append(`<p class='forecastText' id='temp${i}'>Temp: ${data.list[i].main.temp}°C</p>`);
      $(`#forecast${i}`).append(`<p class='forecastText' id='wind${i}'>Wind: ${data.list[i].wind.speed}kph</p>`);
      $(`#forecast${i}`).append(`<p class='forecastText' id='humid${i}'>Humidity: ${data.list[i].main.humidity}%</p>`);
    };
  }
  // Rewrite content if there are divs 
  else {
    for (let i=0; i<6; i++){
      let day = moment().add(i, 'days').format('L');
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
      document.getElementById(`date${i}`).innerHTML = day;
      document.getElementById(`icon${i}`).src = icon;
      document.getElementById(`temp${i}`).innerHTML = `Temp: ${data.list[i].main.temp}`;
      document.getElementById(`wind${i}`).innerHTML = `Wind: ${data.list[i].wind.speed}`;
      document.getElementById(`humid${i}`).innerHTML = `Humidity: ${data.list[i].main.humidity}`;
    }
  }
}

// Save the city name of inputted city to local storage
function saveCity(cityName) {
  // Check if city has already been saved
  let checkCityStorage = true;
  for (let i=0; i<localStorage.length; i++){
    if (localStorage.getItem(SaveCityKey + i) == cityName){
      checkCityStorage = false;
    }
  }
  if (checkCityStorage == true) {
    // save to local storage and create new button for new saved city
    localStorage.setItem(SaveCityKey + localStorage.length, cityName);
    $('#buttons').append(`<button class='btn btn-primary btn-m' id='${SaveCityKey + localStorage.length}'>${cityName}</button>`);
    newListener(SaveCityKey + localStorage.length);
  }
}

// Function to add local storage data and current date to page on load
function loadPage() {
  // Change page date
  let dateText = document.getElementById('date');
  dateText.innerHTML = date;
  // loop through all saved cities in local storage
  for (let i=0; i<localStorage.length; i++){
    // get city and add it as a button
    let savedCityName = localStorage.getItem(SaveCityKey + i);
    $('#buttons').append(`<button class='btn btn-primary btn-m' id='${SaveCityKey + i}'>${savedCityName}</button>`);
    // Add event listener to button
    newListener(SaveCityKey + i);
  }
}

// Event Listeners
// Create listener function
function newListener(cityKey) {
  document.getElementById(`${cityKey}`).addEventListener('click', function() {
    let newCityName = document.getElementById(`${cityKey}`).innerHTML;
    weather(newCityName);
  });
}
// Add City button
let newCity = document.getElementById('add-city');
newCity.addEventListener('click', function(){
  let cityName = document.getElementById('city').value;
  weather(cityName);
});

// Run on load
loadPage();