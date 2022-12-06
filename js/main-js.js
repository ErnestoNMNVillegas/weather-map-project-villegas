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

    marker.on('dragend', dragEnd);

    function dragEnd() {
        var lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
        getFiveDay(lngLat.lat, lngLat.lng);
        airQuality(lngLat.lat, lngLat.lng)
        reverseGeocode(lngLat, MAPBOX_KEY).then(function (results) {
            let markerLocale = ''
            markerLocale += '<h4>' + '5-Day Forecast Location: ' + results + '</h4>';
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
        geocoder.clear();
        getFiveDay(e.result.center[1], e.result.center[0]);
        coordinates.innerHTML = `Longitude: ${e.result.center[1]}<br />Latitude: ${e.result.center[0]}`;
        let resultObj = {
            lat: '',
            lng: ''
        }
        resultObj.lat = e.result.center[1];
        resultObj.lng = e.result.center[0];
        airQuality(e.result.center[1], e.result.center[0])
        reverseGeocode(resultObj, MAPBOX_KEY).then(function (results) {
            let markerLocale = ''
            markerLocale += '<h4>' + '5-Day Forecast Location: ' + results + '</h4>';
            $('#five-day-forecast-location').html(markerLocale);
        });
        return marker.setLngLat(e.result.center)
    });

//// Click function code ////
//// I used the following source for assistance: https://stackoverflow.com/questions/44430030/mapbox-allow-user-to-click-on-map-and-pin

    map.on("click", function (e) {
        getFiveDay(e.lngLat.lat, e.lngLat.lng);
        marker.setLngLat(e.lngLat);
        coordinates.innerHTML = `Longitude: ${e.lngLat.lng}<br />Latitude: ${e.lngLat.lat}`;
        airQuality(e.lngLat.lat, e.lngLat.lng);
        reverseGeocode(e.lngLat, MAPBOX_KEY).then(function (results) {
            let markerLocale = ''
            markerLocale += '<h4>' + '5-Day Forecast Location: ' + results + '</h4>';
            $('#five-day-forecast-location').html(markerLocale);
        });
    });

//// Open Weather Map Code w/ Current Weather Code ////

    $.get("http://api.openweathermap.org/data/2.5/weather", {
        APPID: OPEN_WEATHER_KEY,
        q: "San Antonio, US",
        units: "imperial"
    }).done(function (data) {
        $('#five-day-forecast-location').html(
            '<h4> Current Weather:  San Antonio, TX </h4>' + '<br>' +
            '<h4> Temperature : ' + 'High ' + data.main.temp_max + ' / ' + 'Low ' + data.main.temp_min + ' , ' +
            'Description : ' + data.weather[0].main + ' , ' +
            'Humidity : ' + data.main.humidity + ' , ' +
            'Pressure : ' + data.main.pressure + '. </h4>'
        );
    });

//// Open Weather Pollution Data - Current ////

    function airQuality (lat, lng){
        $.get("http://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lng + "&appid=" + OPEN_WEATHER_KEY + "&units=imperial").done(function (data) {
            var airQualreport = data.list;
            var airQual = airQualreport[0].main.aqi
            var airQaulData = airQualreport[0].components.no2 + ',  ---  Particulate Matter (PM10): ' + airQualreport[0].components.pm10 + ',  ---  Ozone: ' + airQualreport[0].components.o3 + ',  ---   Particulate Matter (PM2.5): ' + airQualreport[0].components.pm2_5
            if (airQual === 1){
                $('#air-qual').html( 'Air Quality Index:  GOOD,  ---  Nitrogen Dioxide: ' + airQaulData)
            } else if (airQual === 2){
                $('#air-qual').html( 'Air Quality Index:  FAIR,  ---  Nitrogen Dioxide: ' + airQaulData)
            } else if (airQual === 3){
                $('#air-qual').html( 'Air Quality Index:  MODERATE,  ---  Nitrogen Dioxide: ' + airQaulData)
            } else if (airQual === 4){
                $('#air-qual').html( 'Air Quality Index:  POOR,  ---  Nitrogen Dioxide: ' + airQaulData)
            } else if (airQual === 5){
                $('#air-qual').html( 'Air Quality Index:  VERY POOR,  ---  Nitrogen Dioxide: ' + airQaulData)
            }
        });
    }

//// Calling function ////

    airQuality(29.4260, -98.4916);


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
                var date = new Date(reports[i].dt_txt).toLocaleDateString('en-US');
                var formatDate = date.split('/').join('-');
                weatherCards += '<div class="card d-flex fiveDay" style="width: 18rem;">' +
                    '<div class="card-header">' + 'Day: ' + formatDate + '<span><img src="http://openweathermap.org/img/w/' + icon + '.png"' + ' alt="img"' + '></span>' +'</div>' +
                    '<ul class="list-group list-group-flush">' +
                    '<li class="list-group-item">' + 'Temp (High/Low): ' + reports[i].main.temp_max + ' / ' + reports[i].main.temp_min + '</li>' +
                    '<li class="list-group-item">' + 'Description: ' + reports[i].weather[0].main + ' / ' + reports[i].weather[0].description + '</li>' +
                    '<li class="list-group-item">' + 'Humidity: ' + reports[i].main.humidity + '</li>' +
                    '<li class="list-group-item">' + 'Pressure: ' + reports[i].main.pressure + '</li>' +
                    '</ul>' +
                    '</div>'
            }
            $('#five-day-card').html(weatherCards);
        });
    }

});
