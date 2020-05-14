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
        '&max=20' +
        '&token=a8507554f000787241ee6f6f22d251cb';
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
      localArticles = [...response.articles];
      checkArticles();
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

function checkArticles() {
    let duplicates = new Set()
    for (var i = 0; i < localArticles.length; i++) {
        for (var j = i + 1 ; j < localArticles.length; j++) {
            if (localArticles[i].title.toLowerCase() == localArticles[j].title.toLowerCase()) {
                duplicates.add(j)
            }
        }
        for (var item of duplicates) {
            localArticles.splice(item, 1)
        }
    }
}

$("#refresh-button").on("click", function() {
    findArticles();
})