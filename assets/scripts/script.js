const baseURL = "https://api.openweathermap.org";
const apiKey = "a54d11b385002d4024b8cb4bebdb0e83"


function getForecast (cityName) {
    let currentDate = moment();
    const days = [];
    fetch( baseURL + "/data/2.5/forecast?" + new URLSearchParams({q: cityName,appid: apiKey} ) )
        .then( (response) => response.json() )
        .then( (data) => {
            data.list.forEach( (tsObj) => {
                let date = moment.unix(tsObj.dt);
                if( !currentDate.isSame(date, "day") && days.length < 6 ) {
                    days.push( tsObj )
                    currentDate = date;
                } else if ( currentDate.isSame(date, "day") && days.length === 0 ) {
                    days.push( tsObj )
                }
            });
        });
    return days;
}


function getStoredForecasts() {
    let currentDay = moment( JSON.parse(localStorage.getItem("current-date")) ) || moment();
    if ( currentDay.isSame( moment(), "day" ) ) {
        return JSON.parse( localStorage.getItem("stored-forecasts") ) || [];
    } else {
        localStorage.setItem("current-date", JSON.stringify( moment() ))
        return [];
    }
}

function storeForecasts( data ) {
    localStorage.setItem("stored-forecasts", JSON.stringify( data ))
}


// Forecast object, with init function, storage and retrieval is all handled internally 