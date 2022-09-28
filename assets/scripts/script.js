const baseURL = "https://api.openweathermap.org";
const apiKey = "a54d11b385002d4024b8cb4bebdb0e83"

function formatResults ( data ) {
    let currentDate = moment();
    let days = [];
    data.list.forEach( (tsObj) => {
        let date = moment.unix(tsObj.dt);
        if( !currentDate.isSame(date, "day") && days.length < 6 ) 
        {
            currentDate = date;
            tsObj.dt_txt = currentDate.format("M/DD/YYYY")
            days.push( tsObj )
        } else if ( currentDate.isSame(date, "day") && days.length === 0 ) {
            tsObj.dt_txt = currentDate.format("M/DD/YYYY")
            days.push( tsObj )
        }
    })

    return days;
}

function getForecast (cityName) {
    fetch( baseURL + "/data/2.5/forecast?" + new URLSearchParams({q: cityName,appid: apiKey, units : "imperial"} ) )
        .then( (response) => response.json() )
        .then( (data) => {
            console.log(data)
            let res = formatResults( data )
            showForecasts(res)
        })
    }

function getHistory() {
    return JSON.parse(localStorage.getItem("forecast-history")) || [];
}

function createCard( parentElem, data ) {
    let date = $("<h4>").text( data.dt_txt )
    let icon = $("<img alt='weather icon' src='' width='50' height='50'>").attr('src', "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
    let temp = $("<p>").text( String(`Temp : ${data.main.temp} °F`) )
    let wind = $("<p>").text( String(`Wind Speed : ${data.wind.speed} MPH`) )
    let humidity = $("<p>").text( String(`Humidity : ${data.main.humidity} %`) )
    parentElem.append(date, icon, temp, wind, humidity)
}

function showForecasts ( data ) {
     let elements = $("#forecasts").children();
     for ( var i = 0; i < 6; i++ ) {
        createCard( $(elements[i]).empty(), data[i] )
     }
}

function manageHistory( city=false ) {
    let history = getHistory();
    if (city) {
        history.push(city)
        localStorage.setItem("forecast-history", JSON.stringify(history))
    }
    return history
}

function showHistory ( history ) {
    let parenteElem = $("#previous-searches").empty();
    for ( const idx in history) {
        parenteElem.append( $("<button class='history-obj col-8'>").text(history[idx]) )
    }
}

showHistory( manageHistory() );

$("#previous-searches").on("click", ".history-obj", function () {
    let city = $(this).text()
    getForecast(city)
})

$("#clear-btn").click( function () {
    localStorage.setItem("forecast-history", JSON.stringify([]))
    showHistory( [] )

} )

$("#search-btn").click( function () {
    let city = $("#city-input").val()
    showHistory( manageHistory( city ) )
    getForecast(city)

} )

// Forecast object, with init function, storage and retrieval is all handled internally 