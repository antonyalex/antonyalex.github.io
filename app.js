let long;
let lat;
let getToken=new Promise((resolve,reject)=>{
 var docRef_api_weather = db.collection("WEATHER_APP_API_KEYS").doc("openweathermap_api_keys");
    var docRef_api_geocoding = db.collection("WEATHER_APP_API_KEYS").doc("locationIQ_geocoding_api_keys");

    docRef_api_weather.get().then((doc) => {
    if (doc.exists) {
        api_key_main= doc.data().main_api_key;
        console.log(api_key_main);
    } else {
        console.log("No such document!");
    }

})
 docRef_api_geocoding.get().then((doc) => {                              
        if (doc.exists) {
            api_key_geocoding= doc.data().main_key;
            console.log(api_key_geocoding);
        } else {
            console.log("No such document!");
        }
    })
    
    
});
getToken.then(()=>{



window.addEventListener('load', () => {
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            long = position.coords.longitude;
            lat = position.coords.latitude;

            getData(long, lat);
            document.getElementById('place_search_submit').onclick = () => {
                let location = (document.getElementById('place_search').value);
                get_place_weather(location);    
                return false;
            };
        })


    }
});
function get_place_weather(location) {
    location.replaceAll(" ", "+")
    const API_KEY_GEOCODING = "pk.ece5a3dc52540838d23f8062865df0bf";
    const api_url = "https://us1.locationiq.com/v1/search.php?key="+API_KEY_GEOCODING+"&q=" + location + "&format=json";
    fetch(api_url)
        .then(response => {
            return response.json();
            
        })
        .then(data3 => {
            
            let lat1 = data3[0].lat;
            let long1 = data3[0].lon;
            return getData(long1, lat1);
        })
    //write code to get lat and long


}
function getData(long, lat) {
    let temperatureDegree = document.querySelector(".temperature-degree");
    let temperatureDescription = document.querySelector(".temperature-description");
    let locationTimezone = document.querySelector(".location-Timezone");
    let locationIcon = document.querySelector('.weather-icon');
    const temperatureSpan = document.querySelector(".temperature span");
    let temperatureSection = document.querySelector(".temperature");
    let temperature_feels_like = document.querySelector(".feels_like");
    let windSpeed = document.querySelector(".wind-speed");
    let windPressure = document.querySelector(".pressure")
    let visibility1 = document.querySelector(".visibility");
    let humidity1 = document.querySelector(".humidity");
    let sunrise = document.querySelector(".sunrise-time");
    let sunset = document.querySelector(".sunset-time");

    const API_KEY = "91a59344c92b5128d956e2d6a2987f04";
    const api = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid="+API_KEY+"&units=metric";
    console.log(api);

    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            const { temp } = data.main;
            const description = data.weather[0].description;
            const location = data.name;
            const icon = data.weather[0].icon;
            const feels_like_variable = data.main.feels_like;
            const wind_speed_variable = data.wind.speed;
            const direction = data.wind.deg;
            const wind_pressure = data.main.pressure;
            const visibility_variable = data.visibility;
            const humidity_variable = data.main.humidity;
            const sunrise_time_unix = data.sys.sunrise;
            const sunset_time_unix = data.sys.sunset;

            console.log(data.weather[0].description);

            temperatureDegree.textContent = temp;
            temperature_feels_like.textContent = "Feels Like:" + feels_like_variable + "C";
            var to_uppercase = description.charAt(0).toUpperCase();
            temperatureDescription.textContent = description.replace(description.charAt(0), to_uppercase);
            locationTimezone.textContent = location;
            locationIcon.innerHTML = '<img src="icons/' + icon
                + '.png"/>';
            temperatureSection.addEventListener("click", () => {
                if (temperatureSpan.textContent === "C") {
                    temperatureSpan.textContent = "F";
                    temperatureDegree.textContent = (temp * 9 / 5) + 32;
                    temperature_feels_like.textContent = "Feels Like:" + ((feels_like_variable * 9 / 5) + 32).toFixed(2) + "F";
                }
                else {
                    temperatureSpan.textContent = "C";
                    temperatureDegree.textContent = temp;
                    temperature_feels_like.textContent = "Feels Like:" + feels_like_variable + "C";
                }

            })
            windSpeed.textContent = "Wind:" + Math.round((wind_speed_variable)) * 18 / 5.0 + " km/hr " + degrees_to_direction(direction);
            windPressure.textContent = "Atmospheric Pressure:" + wind_pressure + " mb";
            visibility1.textContent = "Visibility:" + visibility_variable / 1000 + " km";
            humidity1.textContent = "Humidity:" + humidity_variable + " %";
            sunrise.textContent = "Time of Sunrise:" + convert_unix_timestamp_to_hours_and_minutes(sunrise_time_unix);
            sunset.textContent = "Time of Sunset:" + convert_unix_timestamp_to_hours_and_minutes(sunset_time_unix);


        });
    const api2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=" + api_key_main;
    fetch(api2)
        .then(response => {
            return response.json();
        })
        .then(data2 => {
            console.log(data2);
            globalData = data2



            var i;
            for (i = 0; i <= 6; i++) {
                document.querySelector(".date_day" + i).textContent = convert_unix_timestamp_to_date(data2.daily[i].dt)
                document.querySelector(".day" + i + "_forecast_icon").innerHTML = '<img src="icons/' + data2.daily[i].weather[0].icon + '.png"/>';
                document.querySelector(".day" + i + "_forecast_max_temp").textContent = "Max:" + data2.daily[i].temp.max + "C";
                document.querySelector(".day" + i + "_forecast_min_temp").textContent = "Min:" + data2.daily[i].temp.min + "C";
                document.querySelector(".day" + i + "_forecast_description").textContent = data2.daily[i].weather[0].description;

            }


            //from here code for chart begins
            var hourly_today_temperature = new Array(24);
            var hourly_today_temperature_labels = new Array(24);


            for (var i = 0; i <= 24; i++) {
                hourly_today_temperature[i] = data2.hourly[i].temp;
            }
            for (var j = 0; j <= 24; j++) {
                hourly_today_temperature_labels[j] = convert_unix_timestamp_to_hours_and_minutes(data2.hourly[j].dt);
            }

            console.log(hourly_today_temperature)
            console.log(hourly_today_temperature_labels);

            //chart starts

            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: hourly_today_temperature_labels,
                    datasets: [{
                        label: 'Hourly Temperature in °C',
                        data: hourly_today_temperature,
                        easing: 'linear',
                        pointBackgroundColor: 'rgb(255,255,255)',



                        borderColor: [
                            'rgb(40, 133, 199)',

                        ],

                    }]
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: "white",
                            fontSize: 15
                        }
                    },
                    scales: {

                    },
                    radius: 10,
                    pointRadius: 10,
                    boxWidth: 10,
                    scales: {
                        scaleLabel: [{
                            fontColor: "rgb(255,255,255)"

                        }],
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: "white",

                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return value + "°C";
                                },
                                fontColor: "white"

                            }
                        }]
                    }
                }
            });
            var hourly_today_precipitation = new Array(24);
            var hourly_today_precipitation_labels = new Array(24);


            for (var i1 = 0; i1 <= 24; i1++) {
                hourly_today_precipitation[i1] = (data2.hourly[i1].pop) * 100;
            }
            for (var j1 = 0; j1 <= 24; j1++) {
                hourly_today_precipitation_labels[j1] = convert_unix_timestamp_to_hours_and_minutes(data2.hourly[j1].dt);
            }

            console.log(hourly_today_precipitation)
            console.log(hourly_today_precipitation_labels);
            var ctx1 = document.getElementById('myChart2').getContext('2d');
            var myChart2 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: hourly_today_precipitation_labels,
                    datasets: [{
                        label: 'Hourly Precipitation Probability in %',
                        data: hourly_today_precipitation,
                        easing: 'linear',
                        pointBackgroundColor: 'rgb(255,255,255)',


                        borderColor: [
                            'rgb(40, 133, 199)',

                        ],
                        borderWidth: 3
                    }]
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: "white",
                            fontSize: 15
                        }
                    },
                    radius: 10,
                    pointRadius: 10,
                    boxWidth: 10,
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: "white",

                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return value + "°%";
                                },
                                fontColor: "white"

                            }
                        }]
                    }
                }
            });




        });




}
});






var globalData
var api_key_main
var api_key_geocoding;
function OpenModalwithDetails(dayNo) {
    document.getElementById("weather-icon-daily").innerHTML = '<img src="icons/' + globalData.daily[dayNo].weather[0].icon + '.png"/>';
    document.getElementById("max_daily_temp").innerText = "Max Temperature:" + globalData.daily[dayNo].temp.max + "°C";
    document.getElementById("min_daily_temp").innerText = "Min Temperature:" + globalData.daily[dayNo].temp.min + "°C";
    document.getElementById("morn_temp").innerText = "Morning Temperature:" + globalData.daily[dayNo].temp.day + "°C";
    document.getElementById("evening_temp").innerText = "Evening Temperature:" + globalData.daily[dayNo].temp.eve + "°C";
    document.getElementById("daily_humidity").innerText = "Humidity:" + globalData.daily[dayNo].humidity + "%";
    document.getElementById("pressure_daily").innerText = "Atmospheric Pressure:" + globalData.daily[dayNo].pressure + "mb";
    document.getElementById("uvi_daily").innerText = "UV Index:" + globalData.daily[dayNo].uvi;
    document.getElementById("wind_daily").innerText = Math.round((globalData.daily[dayNo].wind_speed)) * 18 / 5.0 + " km/hr " + degrees_to_direction(globalData.daily[dayNo].wind_deg);
    document.getElementById("precipitation_prob_daily").innerText = "Precipitation Probabitlity:" + (globalData.daily[dayNo].pop) * 100 + "%";
    document.getElementById("dew_point").innerText = "Dew Point:" + globalData.daily[dayNo].dew_point + "°C";
    document.getElementById("sunrise_daily").innerText = "Time of Sunrise:" + convert_unix_timestamp_to_hours_and_minutes(globalData.daily[dayNo].sunrise);
    document.getElementById("sunset_daily").innerText = "Time of Sunset:" + convert_unix_timestamp_to_hours_and_minutes(globalData.daily[dayNo].sunset);
}
function degrees_to_direction(wd) {
    if (wd >= 0 && wd <= 11.25) {

        var dir = "N";

    }

    if (wd > 348.75 && wd <= 360) {

        var dir = "N";

    }

    if (wd > 11.25 && wd <= 33.75) {

        var dir = "NNE";

    }

    if (wd > 33.75 && wd <= 56.25) {

        var dir = "NE";

    }

    if (wd > 56.25 && wd <= 78.75) {

        var dir = "ENE";

    }

    if (wd > 78.75 && wd <= 101.25) {

        var dir = "E";

    }

    if (wd > 101.25 && wd <= 123.75) {

        var dir = "ESE";

    }

    if (wd > 123.75 && wd <= 146.25) {

        var dir = "SE";

    }

    if (wd > 146.25 && wd <= 168.75) {

        var dir = "SSE";

    }

    if (wd > 168.75 && wd <= 191.25) {

        var dir = "S";

    }

    if (wd > 191.25 && wd <= 213.75) {

        var dir = "SSW";

    }

    if (wd > 213.75 && wd <= 236.25) {

        var dir = "SW";

    }

    if (wd > 236.25 && wd <= 258.75) {

        var dir = "WSW";

    }

    if (wd > 258.75 && wd <= 281.25) {

        var dir = "W";

    }

    if (wd > 281.25 && wd <= 303.75) {

        var dir = "WNW";

    }

    if (wd > 303.75 && wd <= 326.25) {

        var dir = "NW";

    }

    if (wd > 326.25 && wd <= 348.75) {

        var dir = "NNW";

    }
    return dir;
}
function convert_unix_timestamp_to_hours_and_minutes(timestamp) {
    var date = new Date(timestamp * 1000);
    var hour = date.getHours();
    var minutes = date.getMinutes();
    if (minutes == "0")
        minutes += "0";
    else if (minutes == "1" || minutes == "2" || minutes == "3" || minutes == "4" || minutes == "5" || minutes == "6" || minutes == "7" || minutes == "8" || minutes == "9")
        minutes = "0" + minutes;

    var time = hour + ":" + minutes;
    return time;
}
function convert_unix_timestamp_to_date(timestamp) {
    var date = new Date(timestamp * 1000);
    var date1 = date.getDate();
    var month = date.getMonth();
    var day = date.getDay();
    var day_name = "";
    if (day == "1")
        day_name = "Mon";
    else if (day == "2")
        day_name = "Tue";
    else if (day == "3")
        day_name = "Wed";
    else if (day == "4")
        day_name = "Thu";
    else if (day == "5")
        day_name = "Fri";
    else if (day == "6")
        day_name = "Sat";
    else
        day_name = "Sun";
    var time = day_name + " " + date1;


    return time;

}