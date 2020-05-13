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
var locationKeyword = "";
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
    if ($("#distance-switch").find("input").prop("checked") == false) {
        locationKeyword = userLocation.city;
    } else {
        if (userLocation.country !== "US") {
            locationKeyword = userLocation.country;
        } else {
            locationKeyword = userLocation.state;
        }
    }

    var queryURL = 'https://gnews.io/api/v3/search?q=' +
        locationKeyword +
        // Consider allowing the user to search with additional keywords
        // "AND" +
        // searchTerm +
        '&max=20' +
        '&token=04a28e0bcb6d0b225d2a3135713547dd';
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            localArticles = response.articles;
            $(".cloned").remove();
            for (var i = 0; i < localArticles.length; i++) {
                var article = localArticles[i];
                var newArticle = $("#template").clone();
                newArticle.addClass("cloned");
                newArticle.find(".header").text(article.title);
                newArticle.find(".date").text(moment(article.publishedAt).format('MMMM Do YYYY, h:mma'));
                newArticle.find(".description").text(article.description);
                newArticle.find("img").attr("src", article.image);
                newArticle.removeAttr("id");
                $("#article-container").append(newArticle);
            }                
    });
}

// function writeArticles () {
//     for (article in localArticles) {

//     }
// }


