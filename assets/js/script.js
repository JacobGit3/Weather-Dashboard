var date = moment().format('L');
console.log(date);

// Create the Daily Forecast divs 
function loadForecast(data) {
  for (var i=0; i<6; i++){
    var info = data.city.name;
    $('#forecast').append(`<div class = 'dailyForecast' id='${i}'>${info}</div>`)
  }
}


// Get the weather for the desired City
function weather(cityName) {
  var key = '5a84980c7b7b783f90dce101ba33a6f6';
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName+ '&appid=' + key)
  // Convert data to json
  .then(function(resp) { return resp.json() })
  .then(function(data) {
    console.log(data.city.name);
    loadForecast(data)
  })
  .catch(function() {
    console.log('Invalid City')
  });
}

window.onload = function() {
  weather('London')
}


function changeDate() {
  var dateText = document.getElementById('date');
  dateText.innerHTML = date;
}

changeDate();
loadForecast()

// Event Listeners

//API KEY 5a84980c7b7b783f90dce101ba33a6f6