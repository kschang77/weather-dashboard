// consolidate into 3 functions

// body.onload init cityList

//debug
// var cityList = ["Austin","Chicago","Orlando","San Francisco"];

var cityList = []

// empty the div

function refreshCity () {
    $("#citydiv").empty();

    // dynamically generate the buttons based on the cityList
    for (var i = 0; i < cityList.length; i++) {
        var btnEl = $("<button>").addClass(
            "btn-city btn btn-outline-primary btn-block text-left"
        );
        btnEl.attr("type", "button");
        btnEl.attr("id", cityList[i]);
        btnEl.text(cityList[i]);
        $("#citydiv").append(btnEl);
    }
}

function saveCity () {
    localStorage.setItem("weatherCities", JSON.stringify(cityList))
}

function loadCity () {
    var t = localStorage.getItem("weatherCities")
    if (t != null ) {
        cityList=JSON.parse(t)
    }
}


var apikey="8164cdd41308f159d85ff4ef8f3b5171" // openweathermap.org
var curlat, curlon; // need it for part 2

function kelvinToFahrenheit(kelvin) {
    return (kelvin-273.15)*1.8+32
}

function queryCurrentWeather(inCity) {
    console.log(inCity)
    // test response "current weather" json packet
    // var testjson =
        // '{"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":300,"main":"Drizzle","description":"light intensity drizzle","icon":"09d"}],"base":"stations","main":{"temp":280.32,"pressure":1012,"humidity":81,"temp_min":279.15,"temp_max":281.15},"visibility":10000,"wind":{"speed":4.1,"deg":80},"clouds":{"all":90},"dt":1485789600,"sys":{"type":1,"id":5091,"message":0.0103,"country":"GB","sunrise":1485762037,"sunset":1485794875},"id":2643743,"name":"London","cod":200}';

    // var res = JSON.parse(testjson);

    // actual queryURL for current weather
    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    var queryurl1 =
        "https://api.openweathermap.org/data/2.5/weather?q=" +  inCity +
        "&appid=" +  apikey;

    // perform AJAX query here
    console.log(queryurl1)

    $.ajax({
        url: queryurl1,
        method: "GET"
    }).then(function(response) {

        res=response 

        console.log(res);

        // var curcity = res.name;
        $("#curcity").text(res.name)

         var curdate = new Date(res.dt*1000);
         console.log(curdate)
        $("#curdate").text(curdate.toLocaleDateString("en-US"))

        var iconweather = res.weather[0].icon; // how to convert that to real icon?
        // console.log(iconweather)
        $("#iconweather").html("<img src='http://openweathermap.org/img/wn/"+iconweather+"@2x.png' />")

        // var curtemp = res.main.temp; // convert from kelvin
        var fahsymbol = "&deg F";
        $("#curtemp").html(Math.round(kelvinToFahrenheit(res.main.temp)*10)/10+decodeURIComponent(fahsymbol));

        // var curhumid = res.main.humidity; // add percentage sign
        $("#curhumid").text (res.main.humidity + "%")

        // var curwind = res.wind.speed; // velocity only?
        $("#curwind").text( Math.round(res.wind.speed*10)/10 + " MPH")
        // we're recording the lat-lon for the UV reading
        curlat = res.coord.lat;

        curlon = res.coord.lon;
        console.log(curlat+" / "+curlon)

        
        queryCurrentUV(curlat, curlon);
        queryForecast(inCity);
    })
}


function queryCurrentUV (curlat, curlon) {
    // need to query UV separately
    // api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37

    console.log(curlat + " / " + curlon);


    var queryurl2 =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" + curlat +
        "&lon=" + curlon + "&appid=" + apikey;

        console.log(queryurl2)
     
    $.ajax({
        url: queryurl2,
        method: "GET"
    }).then(function(res) {

        console.log(res);

        var curUV = res.value;

    // map to display element and update w/ color

        $("#curUV").text(curUV);
        $("#curUV").removeClass();

        $("#curUV").addClass("p-2");

        if (curUV < 3) {
            $("#curUV").addClass("bg-success");
        } else if (curUV < 6) {
            $("#curUV").addClass("bg-warning");
        } else if (curUV < 8 ) {
            $("#curUV").addClass("bg-danger text-white");
        } else if (curUV < 11 ) {
            $("#curUV").addClass("bg-secondary text-white");
        } else {
            $("#curUV").addClass("bg-dark text-white");
        }
    // according to EPA, 
    // <2 is low bg-success
    // 3-5 is moderate bg-warning (yellow)
    // 6-7 is high bg-danger 
    // 8-10 is very high bg-secondary text-white
    // >11 WTF? bg-dark text-white
    });

}

function queryForecast (inCity) {
    // need to query 5 day forecast
    // api.openweathermap.org/data/2.5/forecast?q=London,us

    var queryurl3 =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + inCity + 
    "&appid=" + apikey;

    console.log(queryurl3)
     
    $.ajax({
        url: queryurl3,
        method: "GET"
    }).then(function(res) {

        console.log(res);

        // for testing, we'll just assume x=0
        // x = 1 ;
        for (x=1 ; x<=5 ; x++) {

            y = 4+(x-1)*8
            
            console.log(res.list[y])
                // must filter as you can get multiple entries per date

            var curdate2 = res.list[y].dt_txt; // chop to fit
            // curdate2 = curdate2.substr(0,curdate2.indexOf(' '));
            var curdate2x = new Date(curdate2)
            console.log(curdate2x)
            $(".curdate2.day-"+x).text(curdate2x.toLocaleDateString("en-US"))
            // get icon

            var curicon2 = res.list[y].weather[0].icon;
        // console.log(iconweather)
            $(".curicon2.day-"+x).html("<img src='http://openweathermap.org/img/wn/"+curicon2+"@2x.png' />")


            // get temp
            var fahsymbol = "&deg F";
            var curtemp2 = res.list[y].main.temp; // convert from kelvin
            $(".curtemp2.day-"+x).html(Math.round(kelvinToFahrenheit(curtemp2)*10)/10+decodeURIComponent(fahsymbol));

            // get humidity
            var curhumid2 = res.list[y].main.humidity; //
            $(".curhumid2.day-"+x).text(curhumid2+"%");
        }
    })
}

// event handlers

// one for the left-column "city" button clicks
// as these are dynamic, one needs to attach at document level and filter down

$(document).on("click", ".btn-city", function(event) {
  // once inside, it calls in succession
    var curcity = $(this).attr("id") // That gives the city

  // queryCurrentWeather
    queryCurrentWeather(curcity);;

});

// one for the search button 
// search button adds a button to the #citydiv container populated as a button
// if the city is valid, but need to know what validation to accept

$(".form-inline").on('submit', function(event){
    event.preventDefault();
    var tempCity = $("#city").val(); 
    cityList.unshift(tempCity)
    console.log(cityList)
    saveCity();
    $("#city").val("");
    refreshCity();
    queryCurrentWeather(tempCity);
})

// init
loadCity();
refreshCity();
if (cityList.length > 0) {
  queryCurrentWeather(cityList[0]);
//   $("#citydiv:first-child").addClass("active")
}

