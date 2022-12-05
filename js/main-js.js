"use strict";

$(function () {

//// MapBox Code ////

    mapboxgl.accessToken = MAPBOX_KEY;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 10,
        center: [-98.4916, 29.4260]
    });

//// Draggable marker code ////
// https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/

    var marker = new mapboxgl
        .Marker({draggable: true, color: "red"})
        .setLngLat([-98.4916, 29.4260])
        .addTo(map)

    marker.on('dragend', onDragEnd);

    function onDragEnd() {
        var lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
        getFiveDay(lngLat.lat, lngLat.lng);
        reverseGeocode(lngLat, MAPBOX_KEY).then(function (results) {
            let markerLocale = ''
            markerLocale += '<h3>' + '5-Day Forcast Location: ' + results + '</h3>';
            $('#five-day-forecast-location').html(markerLocale);
        });
    }

//// Mapbox geocoder code ////
//This is the source I used to modify the geocode function  https://stackoverflow.com/questions/62411816/add-a-dragable-marker-after-geocoder-result-in-mapbox-gl-js

    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });

    map.addControl(geocoder);

    geocoder.on('result', function (e) {
        console.log(e.result.center);
        geocoder.clear();
        getFiveDay(e.result.center[1], e.result.center[0]);
        let resultObj = {
            lat: '',
            lng: ''
        }
        resultObj.lat = e.result.center[1];
        resultObj.lng = e.result.center[0];
        reverseGeocode(resultObj, MAPBOX_KEY).then(function (results) {
            let markerLocale = ''
            markerLocale += '<h3>' + '5-Day Forecast Location: ' + results + '</h3>';
            $('#five-day-forecast-location').html(markerLocale);
        });
        return marker.setLngLat(e.result.center)
    });

    //Click function code.
    // I used the following source for assistance: https://stackoverflow.com/questions/44430030/mapbox-allow-user-to-click-on-map-and-pin

    map.on("click", function (e) {
        getFiveDay(e.lngLat.lat, e.lngLat.lng);
        reverseGeocode(e.lngLat, MAPBOX_KEY).then(function (results) {
            let markerLocale = ''
            markerLocale += '<h3>' + '5-Day Forecast Location: ' + results + '</h3>';
            $('#five-day-forecast-location').html(markerLocale);
        });
    });

    $('#user-search-btn').click(function (e) {
        e.preventDefault();
        console.log("click detected");
        let text = $("#user-search").val();
        console.log(text);
        //// Re-centers marker ////
        geocode(text, MAPBOX_KEY).then(function (results) {
            console.log(results);
            getFiveDay(results[1], results[0]);
            let resultObj = {
                lat: '',
                lng: ''
            }
            resultObj.lat = results[1];
            resultObj.lng = results[0];
            return marker.setLngLat(resultObj);
        })
        //// Re-centers Map ////
        geocode(text, MAPBOX_KEY).then(function (results) {
            console.log(results);
            getFiveDay(results[1], results[0]);
            return map.setCenter(results);
        })
        let markerLocale = ''
        markerLocale += '<h3>' + '5-Day Forcast Location: ' + text + '</h3>';
        $('#five-day-forecast-location').html(markerLocale);
    })

//// Open Weather Map Code w/ Current Weather Code ////

    $.get("http://api.openweathermap.org/data/2.5/weather", {
        APPID: OPEN_WEATHER_KEY,
        q: "San Antonio, US",
        units: "imperial"
    }).done(function (data) {
        $('#five-day-forecast-location').html(
            '<h3> Current Weather:  San Antonio, TX </h3>' + '<br>' +
            '<h3> Temperature : ' + 'High ' + data.main.temp_max + ' / ' + 'Low ' + data.main.temp_min + ' , ' +
            'Description : ' + data.weather[0].main + ' , ' +
            'Humidity : ' + data.main.humidity + ' , ' +
            'Pressure : ' + data.main.pressure + '. </h3>'
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

//// San Antonio 5 Day Forecast Code ////
    getFiveDay(29.4260, -98.4916);

    //icon source https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
    //date format source https://stackoverflow.com/questions/64373549/how-do-i-reformat-the-date-from-openweather-api-using-javascript
    //5-day forecast function.  I used information from the following post to figure this out:  https://javascript.plainenglish.io/display-7-day-weather-forecast-with-openweather-api-aac8ba21c9e3

    function getFiveDay(lat, lng) {
        $.get("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lng + "&appid=" + OPEN_WEATHER_KEY + "&units=imperial").done(function (data) {
            var reports = data.list;
            let weatherCards = '';
            for (let i = 0; i < reports.length; i += 8) {
                var icon = reports[i].weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
                $('#wxicon').attr('src', iconurl);
                var date = new Date(reports[i].dt_txt).toLocaleDateString('en-US');
                var formatDate = date.split('/').join('-');
                weatherCards += '<div class="card d-flex fiveDay" style="width: 18rem;">' +
                    '<div class="card-header">' + 'Day: ' + formatDate + '</div>' +
                    '<ul class="list-group list-group-flush">' +
                    '<li class="list-group-item">' + 'Temp (High/Low): ' + reports[i].main.temp_max + ' / ' + reports[i].main.temp_min + '</li>' +
                    '<li class="list-group-item">' + 'Description: ' + reports[i].weather[0].main + ' / ' + reports[i].weather[0].description + '</li>' +
                    '<li class="list-group-item">' + 'Humidity: ' + reports[i].main.humidity + '</li>' +
                    '<li class="list-group-item">' + 'Pressure: ' + reports[i].main.pressure + '</li>' +
                    '<li class="list-group-item">' + '<img id="wxicon" src=" " alt="wx icon">' + '</li>' +
                    '</ul>' +
                    '</div>'
                // console.log(reports[i]);
            }
            $('#five-day-card').html(weatherCards);
        });
    }

});
