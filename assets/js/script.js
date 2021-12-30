// Global Variables
let date = moment().format('L');
const SaveCityKey = 'City';

// Get the weather for the desired City
function weather(cityName) {
  // Make sure there is a city name
  if (cityName === ''){
    console.log('No city inputted')
    return
  }
  const APIkey = '5a84980c7b7b783f90dce101ba33a6f6';
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + APIkey)
  // Convert data to json
  .then(function(resp) { return resp.json() })
  .then(function(data) {
    if (data.cod == '404') {
      let cityName = document.getElementById('city');
      cityName.value = 'Invalid City'
    }else {
      loadForecast(data);
      saveCity(cityName);
    }
  })
  // Catch errors
  .catch(function() {
    console.log('ERROR')
  });
}

// Create the Daily Forecast divs 
function loadForecast(data) {
  // Create divs if none
  if ( $('#forecast').children().length == 0 ){
    for (let i=0; i<6; i++){
      let day = moment().add(i, 'days').format('L')
      $('#forecast').append(`<div class='dailyForecast' id='forecast${i}'></div>`)
      $(`#forecast${i}`).append(`<h3 class='forecastdate' id='date${i}'>${day}</h3>`);
      $(`#forecast${i}`).append(`<p class='forecastTemp' id='temp${i}'>Temp: ${data.list[i].main.temp}°C</p>`);
      $(`#forecast${i}`).append(`<p class='forecastWind' id='wind${i}'>Wind: ${data.list[i].wind.speed} KPH</p>`);
      $(`#forecast${i}`).append(`<p class='forecastHumid' id='humid${i}'>Humidity: ${data.list[i].main.humidity}%</p>`);
    };
  }
  // Rewrite content if there are divs 
  else {
    for (let i=0; i<6; i++){
      let day = moment().add(i, 'days').format('L')
      document.getElementById(`date${i}`).innerHTML = day;
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
loadPage()