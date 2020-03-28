var apikey="8164cdd41308f159d85ff4ef8f3b5171" // openweathermap.org


// test response "current weather" json packet 
var testjson = '{"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":300,"main":"Drizzle","description":"light intensity drizzle","icon":"09d"}],"base":"stations","main":{"temp":280.32,"pressure":1012,"humidity":81,"temp_min":279.15,"temp_max":281.15},"visibility":10000,"wind":{"speed":4.1,"deg":80},"clouds":{"all":90},"dt":1485789600,"sys":{"type":1,"id":5091,"message":0.0103,"country":"GB","sunrise":1485762037,"sunset":1485794875},"id":2643743,"name":"London","cod":200}';

var res = JSON.parse(testjson)

// actual queryURL
//api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

// fields needed and mapped

var curcity=res.name 
var curdate = res.dt;
var iconweather = res.weather.icon // how to convert that to real icon?

var curtemp = res.main.temp // convert from kelvin

var curhumid = res.main.humidity // add percentage sign

var curwind = res.wind.speed // velocity only?

// we're recording the lat-lon for the UV reading

var curlat = res.coord.lat;

var curlon = res.coord.lon;

// need to query UV separately

// api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37

var curUV = res.value;

// need to query 5 day forecast

// api.openweathermap.org/data/2.5/forecast?q=London,us

// res.list[x]

// must filter as you can get multiple entries per date

var curdate2 = res.list[x].dt_txt // chop to fit

// get icon

var curicon2 = res.list[x].weather.icon;

// get temp

var curtemp2 = res.list[x].main.temp_max // convert from kelvin

// get humidity

var curhumid2 = res.list[x].main.humidity // 