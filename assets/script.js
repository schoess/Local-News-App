// This is for the sidenav

$(document).ready(function () {
    $('.sidenav').sidenav({
        onCloseStart: function () {
            findArticles();
        }
    });
    $('.dropdown-trigger').dropdown();
    $('#slide-out')
        .sidenav()
});

var userLocation = { "city": "", "state": "", "country": "" };
var pastLocations = [];
var locationKeyword = "";
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
        pastLocations.unshift({ ...userLocation });
    } else {
        console.log("Current city is already stored in pastLocations")
    }
    $("#search-key").text(" " + fullName);
}

function searchArray() {
    for (var i = 0; i < pastLocations.length; i++) {
        if (pastLocations[i].city === userLocations.city) {
            return false;
        } else {
            return true;
        }
    }
}

function findArticles() {
    if ($("#distance-switch").find("input").prop("checked") == false) {
        locationKeyword = userLocation.city;
    } else {
        if (userLocation.country !== "US") {
            locationKeyword = userLocation.country;
        } else {
            locationKeyword = userLocation.state;
        }
    }
    if ($("#search").val() !== "") {
        locationKeyword += (" " + $("#search").val());
        $("#search").val("");
    }
    var queryURL = 'https://gnews.io/api/v3/search?q=' +
        locationKeyword +
        // Consider allowing the user to search with additional keywords
        // "AND" +
        // searchTerm +
        '&max=20' +
        '&token=583daeaee1977d97f8b1a5b323ef23d8';
    // 583daeaee1977d97f8b1a5b323ef23d8
    if ($("#time-switch").find("input").prop("checked") == true) {
        queryURL += "&mindate=" + moment().subtract(14, 'days').format("YYYY-MM-DD");
        queryURL += "&maxdate=" + moment().subtract(7, 'days').format("YYYY-MM-DD");
    }
    $.ajax({
      url: queryURL,
      method: "GET",
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
            newArticle.find(".date").text(article.source.name + " | " + moment(article.publishedAt).format('MMMM Do YYYY, h:mma'));
            newArticle.attr("href", article.url)
            newArticle.find(".description").text(article.description);
            newArticle.find("img").attr("src", article.image);
            newArticle.removeAttr("id");
            $("#article-container").append(newArticle);
        }
    });
}

$("#refresh-button").on("click", function() {
    findArticles();
})