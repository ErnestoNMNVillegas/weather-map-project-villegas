"use strict";

$(function() {

var weatherDataObj = {};


//Open Weather Map Code

$.get("http://api.openweathermap.org/data/2.5/weather", {
    APPID: OPEN_WEATHER_KEY,
    q:     "San Antonio, US",
    units: "imperial"
}).done(function(data) {
    weatherDataObj = data;
    console.log(data);
    console.log(weatherDataObj);
    // return weatherDataObj;
    $('#weather-display p').html(
        'Current Weather' + '<br>' +
        'Temperature : ' + 'High ' + data.main.temp_max + ' / ' + 'Low ' + data.main.temp_min + ' , ' +
        'Description : ' + data.weather[0].main + ' , ' +
        'Humidity : ' + data.main.humidity + ' , ' +
        'Pressure : ' + data.main.pressure + ' , '
    );
});

    // console.log(weatherDataObj);

$.get("http://api.openweathermap.org/data/2.5/onecall", {
    APPID: OPEN_WEATHER_KEY,
    lat:    29.423017,
    lon:   -98.48527,
    units: "imperial"
}).done(function(data) {
    console.log('The entire response:', data);
    console.log('Diving in - here is current information: ', data.current);
    console.log('A step further - information for tomorrow: ', data.daily[1]);
    console.log(weatherData);
});




// MapBox Code
    mapboxgl.accessToken = MAPBOX_KEY;
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 10,
    center: [-98.4916, 29.4252]
});



// currentWxObj.forEach((item) => {
//
//     var Marker = new mapboxgl.Marker()
//         .setLngLat([-98.4916, 29.4252])
//         .addTo(map);
//
//     var Popup = new mapboxgl.Popup()
//         .setHTML(item.main, )
//
//     Marker.setPopup(Popup)
// });


});
