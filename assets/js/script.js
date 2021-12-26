var date = moment().format('L');
console.log(date);

// Get the weather for the desired City
function weather(cityName) {
  var key = '5a84980c7b7b783f90dce101ba33a6f6';
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName+ '&units=metric&appid=' + key)
  // Convert data to json
  .then(function(resp) { return resp.json() })
  .then(function(data) {
    console.log(data)
    console.log(data.list[0].main.temp);
    loadForecast(data)
  })
  .catch(function() {
    console.log('Invalid City')
  });
}

// Create the Daily Forecast divs 
function loadForecast(data) {
  for (var i=0; i<6; i++){
    var info = [
      data.list[i].weather.icon,
      data.list[i].main.temp,
      data.list[i].wind.speed,
      data.list[i].main.humidity
    ];
    $('#forecast').append(`<div class='dailyForecast' id='${i}'></div>`)
    $(`#${i}`).append(`<h3 class='forecastdate' id='${i}date'>${date}</h3>`);
    $(`#${i}`).append(`<img class='forecastIcon' id='${i}' src=${info[0]}/>`);
    $(`#${i}`).append(`<p class='forecastTemp' id='${i}temp'>Temp:${info[1]}°C</p>`);
    $(`#${i}`).append(`<p class='forecastWind' id='${i}wind'>Wind:${info[2]} KPH</p>`);
    $(`#${i}`).append(`<p class='forecastHumid' id='${i}humid'>Humidity:${info[3]}%</p>`);
  }
}

function changeDate() {
  var dateText = document.getElementById('date');
  dateText.innerHTML = date;
}

weather('London')
changeDate();
loadForecast()

// Event Listeners
$('#add-city').click(function() {
  console.log('pressed')
})

//API KEY 5a84980c7b7b783f90dce101ba33a6f6
