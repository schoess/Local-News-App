// Newsapi.org
// var queryURL = 'http://newsapi.org/v2/everything?q=' +
//     subject +
//     '&sortBy=relevancy' +
//     '&pageSize=10' +
//     '&apiKey=51d68d8527904bf68e3a70ba046f4112';

var userLocation = {"city": "", "state": "", "country": ""};
var pastLocations = [];
var fullName = "";
var localArticles = "";

window.onload = function () {
    $.ajax({
        url: "https://get.geojs.io/v1/ip/geo.json",
        method: "GET"
    })
        .then(function (location) {
            console.log(location);
            saveLocation(location);
            // Maybe move this out of this location?
            findArticles();
    });
}

function saveLocation(location) {
    userLocation.city = location.city;
    if (location.country_code == "US") {
        userLocation.state = location.region;
    }
    userLocation.country = location.country_code;
    if (userLocation.country !== "US") {
        fullName = userLocation.city + ", " + userLocation.country;
    } else {
        fullName = userLocation.city + ", " + userLocation.state;
    }
    if (pastLocation == "") {
        pastLocation.unshift({...userLocation});
    } else if (Object.values(userLocation.city).includes(pastLocation.city)) {
        console.log("Current city is already stored in pastLocations")
    }
}

function findArticles () {
    var queryURL = 'https://gnews.io/api/v3/search?q=' +
        userLocation.city +
        '&max=20' +            
        '&token=34cd4a8de7e6782a7018500f289c1964';
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            localArticles = response;
    });
}

// function writeArticles () {
//     for (article in localArticles) {

//     }
// }