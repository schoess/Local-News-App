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
        '&token=04a28e0bcb6d0b225d2a3135713547dd';
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




