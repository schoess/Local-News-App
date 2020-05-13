// This is for the sidenav

$(document).ready(function(){
  $('.sidenav').sidenav();
  $('.dropdown-trigger').dropdown();
  $('#slide-out')
        .sidenav()
        .on('click tap', 'li a', () => {
            $('#slide-out').sidenav('close');
        });
})





// Newsapi.org
// var queryURL = 'http://newsapi.org/v2/everything?q=' +
//     subject +
//     '&sortBy=relevancy' +
//     '&pageSize=10' +
//     '&apiKey=51d68d8527904bf68e3a70ba046f4112';

// document.addEventListener('DOMContentLoaded', function() {
//   var elems = document.querySelectorAll('.sidenav');
//   var instances = M.Sidenav.init(elems, options);
// });

// $(document).ready(function(){
//   $('.sidenav').sidenav();
// });


var userLocation = {"city": "", "state": "", "country": ""};
var pastLocations = [];
// var fullName = "";
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
    if (pastLocations == "" || searchArray() == true) {
        pastLocations.unshift({...userLocation});
    } else {
        console.log("Current city is already stored in pastLocations")
    }
    $("#search-key").text(" " + fullName);
}

function searchArray () {
    for (var i=0; i < pastLocations.length; i++) {
        if (pastLocations[i].city === userLocations.city) {
            return false;
        } else {
            return true;
        }
    }
}

function findArticles () {
    var queryURL = 'https://gnews.io/api/v3/search?q=' +
        userLocation.city +
        // Consider allowing the user to search with additional keywords
        // "AND" +
        // searchTerm +
        '&max=20' +
        '&token=34cd4a8de7e6782a7018500f289c1964';
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            localArticles = response.articles;

            //Appends article info to page
            // $(".s2").append("<div class='thumbnailHolder'>" + 
            // "<img class='thumbnail' src='" + response.articles[1].image + "' alt='Article Thumbnail'>" + "</div>");
            // $(".s6").append("<h5 class='title'>" + response.articles[1].title + "</h5>");
            // $(".s6").append("<hp class='description'>" + response.articles[1].description + "</p>");
            for (var i = 0; i < localArticles.length; i++) {
                var article = localArticles[i];
                var newArticle = $("#template").clone();
                newArticle.find(".header").text(article.title);
                newArticle.find("p").text(article.description);
                newArticle.find("img").attr("src", article.image);
                $("#article-container").append(newArticle);
            } 
            $("#template").remove();                  
    });
}

// function writeArticles () {
//     for (article in localArticles) {

//     }
// }


