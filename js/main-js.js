"use strict";

$(function() {



// MapBox Code
    //https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/
    mapboxgl.accessToken = MAPBOX_KEY;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 10,
        center: [-98.4916, 29.4260]
    });

// Marker Code

    const marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat([-98.4916, 29.4260])
        .addTo(map);

    function onDragEnd() {
        const lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
        getFiveDay(lngLat.lat, lngLat.lng);
        console.log(lngLat);
        reverseGeocode(lngLat, MAPBOX_KEY).then(function(results) {
            let markerLocale = ''
            markerLocale += '<P>' + 'Marker Locatiion: ' + results + '</P>';
            $('#marker-location').html(markerLocale);
        });
    }

    marker.on('dragend', onDragEnd);

    //This is the click function code.
    // I used the following source for assistance: https://stackoverflow.com/questions/44430030/mapbox-allow-user-to-click-on-map-and-pin

    map.on("click", function(e){
        console.log("background click", e.lngLat);
        getFiveDay(e.lngLat.lat, e.lngLat.lng);
        reverseGeocode(e.lngLat, MAPBOX_KEY).then(function(results) {
            let markerLocale = ''
            markerLocale += '<P>' + 'Clicked Locatiion: ' + results + '</P>';
            $('#clicked-location').html(markerLocale);
        });
    });

    $('#user-search').click(function (e){
        e.preventDefault();
        let text = $("#user-search").val();
        console.log(text);
        geocode("15513 Dell Lane, Selma, Texas 78154", MAPBOX_KEY).then(function(results) {
            // function setMarker(results) {
            //     marker.setLngLat([results]);
            // }
            getFiveDay(results);
        })
        console.log(results);
    })

    // geocode("15513 Dell Lane, Selma, Texas 78154", MAPBOX_KEY).then(function(results) {
    //     function setMarker(results) {
    //         marker.setLngLat([results]);
    //     }
    //     console.log(results);
    // })

//Open Weather Map Code w/ Current Weather Code

$.get("http://api.openweathermap.org/data/2.5/weather", {
    APPID: OPEN_WEATHER_KEY,
    q:     "San Antonio, US",
    units: "imperial"
}).done(function(data) {
    $('#weather-current-display p').html(
        'Current Weather:  San Antonio, TX' + '<br>' +
        'Temperature : ' + 'High ' + data.main.temp_max + ' / ' + 'Low ' + data.main.temp_min + ' , ' +
        'Description : ' + data.weather[0].main + ' , ' +
        'Humidity : ' + data.main.humidity + ' , ' +
        'Pressure : ' + data.main.pressure + '.'
    );
});

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

    //San Antonio 5 Day Forecast
    getFiveDay(29.4260, -98.4916);

    //5-day forecast function.  I used information from the following post to figure this out:  https://javascript.plainenglish.io/display-7-day-weather-forecast-with-openweather-api-aac8ba21c9e3
    function getFiveDay(lat, lng){
        $.get("http://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lng +"&appid=" + OPEN_WEATHER_KEY + "&units=imperial").done(function(data) {
            var reports = data.list;
            let weatherCards = '';
            for(let i = 0; i < reports.length; i += 8) {
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
                // console.log(reports[i]);
            }
            $('#five-day-card').html(weatherCards);
        });
    }

});
