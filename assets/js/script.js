// Global Variables
let date = moment().format('L');
const SaveCityKey = 'City';

// Get the weather for the desired City
function weather(cityName) {
  // Make sure there is a city name
  if (cityName === ''){
    console.log('error')
    return
  }
  const APIkey = '5a84980c7b7b783f90dce101ba33a6f6';
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + APIkey)
  // Convert data to json
  .then(function(resp) { return resp.json() })
  .then(function(data) {
    loadForecast(data);
    saveCity(cityName);
  })
  // Catch errors
  .catch(function() {
    console.log('Invalid City')
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

// Change/Update the date at the top of the page
function changeDate() {
  let dateText = document.getElementById('date');
  dateText.innerHTML = date;
}

// Save the city name of inputted city to local storage
function saveCity(cityName) {
  let numberOfCities = localStorage.length;
  localStorage.setItem(SaveCityKey + cityName, cityName);
  // Check if a new city was added, if user inputs same city, don't create a new button
  if (numberOfCities != localStorage.length) {
    // Create new button for new saved city
    $('#buttons').append(`<button class='btn btn-primary btn-m' id='${cityName}'>${cityName}</button>`);
    newListener(cityName);
  }  
}

// Event Listeners
// Create Event Listener Function
function newListener(cityName) {
  let newButton = document.getElementById(`${cityName}`);
  newButton.addEventListener('click', function() {weather(newButton.innerHTML)});
}
// Add City button
let newCity = document.getElementById('add-city');
newCity.addEventListener('click', function(){
  let cityName = document.getElementById('city').value;
  weather(cityName);
  console.log(cityName)
});

// Run on load
changeDate();