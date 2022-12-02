"use strict";

$(function() {


//Open Weather Map Code w/ Current Weather Code

$.get("http://api.openweathermap.org/data/2.5/weather", {
    APPID: OPEN_WEATHER_KEY,
    q:     "San Antonio, US",
    units: "imperial"
}).done(function(data) {
    // weatherDataObj = data;
    // console.log(data);
    // console.log(weatherDataObj);
    // // return weatherDataObj;
    $('#weather-current-display p').html(
        'Current Weather' + '<br>' +
        'Temperature : ' + 'High ' + data.main.temp_max + ' / ' + 'Low ' + data.main.temp_min + ' , ' +
        'Description : ' + data.weather[0].main + ' , ' +
        'Humidity : ' + data.main.humidity + ' , ' +
        'Pressure : ' + data.main.pressure + ' , '
    );
});

    // console.log(weatherDataObj);

    //One call below not working

// $.get("http://api.openweathermap.org/data/2.5/onecall", {
//     APPID: OPEN_WEATHER_KEY,
//     lat:    29.423017,
//     lon:   -98.48527,
//     units: "imperial"
// }).done(function(data) {
//     console.log('The entire response:', data);
//     console.log('Diving in - here is current information: ', data.current);
//     console.log('A step further - information for tomorrow: ', data.daily[1]);
//     console.log(weatherData);
// });




// MapBox Code
    mapboxgl.accessToken = MAPBOX_KEY;
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 10,
    center: [-98.4916, 29.4252]
    });

    //San Antonio 5 Day Forecast

    let lat = 29.423017;
    let long = -98.48527;
    $.get("http://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ long +"&appid=" + OPEN_WEATHER_KEY + "&units=imperial").done(function(data) {
        var reports = data.list;
        for(let i = 0; i < reports.length; i += 8) {
            let weatherCards = '';
            // reports.forEach((value, index) => {
                // if (index < 5) {
                    // var date = new Date(value.dt * 1000).toLocaleDateString("en", {
                    //     weekday: "long",
                    // });
                    var icon = reports[i].weather[0].icon;
                    weatherCards += '<div class="card d-flex fiveDay" style="width: 18rem;">' +
                        '<div class="card-header">' + 'Day ' + reports[i].dt_txt + '</div>' +
                        '<ul class="list-group list-group-flush">' +
                        '<li class="list-group-item">' + 'Temp (High/Low): ' + reports[i].main.temp_max + ' / '+ reports[i].main.temp_min + '</li>' +
                        '<li class="list-group-item">' + 'Description: ' + reports[i].weather[0].main + ' / ' + reports[i].weather[0].description +  '</li>' +
                        '<li class="list-group-item">' + 'Humidity: ' + reports[i].main.humidity + '</li>' +
                        '<li class="list-group-item">' + 'Pressure: ' + reports[i].main.pressure + '</li>' +
                        '<li class="list-group-item">' + icon + '</li>' +
                        '</ul>' +
                        '</div>'
                    $('#five-day-card').append(weatherCards);
                // }
            // });
            console.log(reports[i]);
        }
    });


    //This is the drop pin function.
    // I obtained this source from https://stackoverflow.com/questions/44430030/mapbox-allow-user-to-click-on-map-and-pin
    //I then added the 5 day forecast GET.

    map.on("click", function(e){
        console.log("background click", e.lngLat);
        var pinData = {
            type: "FeatureCollection",
            features: [{
                type:"Feature",
                geometry: { type: "Point", coordinates: [ e.lngLat.lng, e.lngLat.lat ]}
            }]
        };
        map.addSource("pins", {
            "type": "geojson",
            "data": pinData
        });
        map.addLayer({
            id: "pinsLayer",
            type: "circle",
            source: "pins",
            paint: {
                "circle-color": "red",
                "circle-radius": 5
            }
        });

        getFiveDay(e.lngLat.lat, e.lngLat.lng);
    });



    function getFiveDay(lat, lng){
        $.get("http://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lng +"&appid=" + OPEN_WEATHER_KEY + "&units=imperial").done(function(data) {
            var reports = data.list;
            for(let i = 0; i < reports.length; i += 8) {
                let weatherCards = '';
                var icon = reports[i].weather[0].icon;
                weatherCards += '<div class="card d-flex fiveDay" style="width: 18rem;">' +
                    '<div class="card-header">' + 'Day ' + reports[i].dt_txt + '</div>' +
                    '<ul class="list-group list-group-flush">' +
                    '<li class="list-group-item">' + 'Temp (High/Low): ' + reports[i].main.temp_max + ' / '+ reports[i].main.temp_min + '</li>' +
                    '<li class="list-group-item">' + 'Description: ' + reports[i].weather[0].main + ' / ' + reports[i].weather[0].description +  '</li>' +
                    '<li class="list-group-item">' + 'Humidity: ' + reports[i].main.humidity + '</li>' +
                    '<li class="list-group-item">' + 'Pressure: ' + reports[i].main.pressure + '</li>' +
                    '<li class="list-group-item">' + icon + '</li>' +
                    '</ul>' +
                    '</div>'
                $('#five-day-card').append(weatherCards);
            }
        });
    };



});
