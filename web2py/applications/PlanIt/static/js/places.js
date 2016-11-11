// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var placesList;
var listOfResults;

function initMap() {
  var pyrmont = {
    lat: 37.3230,
    lng: -122.0322
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 17
  });

    var placeID = document.getElementById('places');

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 500,
    type: ['store']
  }, processResults);
}

function processResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    createMarkers(results);

    if (pagination.hasNextPage) {
      var moreButton = document.getElementById('more');

      moreButton.disabled = false;

      moreButton.addEventListener('click', function() {
        moreButton.disabled = true;
        pagination.nextPage();
      });
    }
  }
}

// function getEventTarget(e) {
//     e = e || window.event;
//     return e.target || e.srcElement;
// }

function createMarkers(results) {
    listOfResults = results;
    var bounds = new google.maps.LatLngBounds();
    placesList = document.getElementById('places');

    for (var i = 0, place; place = results[i]; i++) {
        // var image = {
        //   url: place.icon,
        //   size: new google.maps.Size(71, 71),
        //   origin: new google.maps.Point(0, 0),
        //   anchor: new google.maps.Point(17, 34),
        //   scaledSize: new google.maps.Size(25, 25)
        // };

        // var marker = new google.maps.Marker({
        //   map: map,
        //   // icon: image,
        //   title: place.name,
        //   position: place.geometry.location
        // });


        //append to a data array.
        //figure out how to set an olick listner
        var currentPrice = null;
        var currentRating = null;

        if (place.price_level != undefined) {
            currentPrice = place.price_level;
        }
        else {
            currentPrice = 'N/A';
        }

        if (place.rating != undefined) {
            currentRating = place.rating;
        }
        else {
            currentRating = "No rating found";
        }

        placesList.innerHTML +=
            '<div class="sugg-card" id = "cardId">' +
            '<div class="pull-left">' +
            '<a href="#">' +
            '<img class="imgClass-thumbnail" src="http://3.bp.blogspot.com/-IbEOTNtCMyU/TfCAdHaAxEI/AAAAAAAAA8U/EATib38SSAM/s320/joe-mcelderry.jpg">' +
            '</a>' +
            '</div>' +
            '<div class="sugg-card-body">' +
            '<h2>' + place.name + '</h2>' +
            '<p>' + place.vicinity + '</p>' +
            '</div>' +
            '<div class="sugg-card-footer">' +
            '<span style="display: inline-block; float: left;">' +
            'Price:' + currentPrice +
            '</span>' +
            '<span class="rating">' +
            'Rating: ' + currentRating +
            '</span>' +
            '</div>' +
            '</div>';

        // var temp = place.name;
        // var divClick  = document.getElementById('cardId');
        // divClick.onclick = function(event) {
        //     var target = getEventTarget(event);
        //     console.log(target);
        //
        //     console.log(temp);
        //
        // };
        //
        //     var placeCard = document.getElementById('cardId');
        //     google.maps.event.addDomListener(placeCard, 'click', function() {
        //         console.log("LOLCLOCL");
        //     });


        bounds.extend(place.geometry.location);
    }
    // var placeCard = document.getElementsByClassName("sugg-card");
    // console.log(placeCard);
    // for (var i = 0; i < placeCard.length; i++) {
    //     //results array at element i.
    //     google.maps.event.addDomListener(placeCard[i], 'click', function () {
    //         console.log("LOLCLOCL" + i);
    //         console.log(results[i]);
    //
    //
    //     });
    // }

  map.fitBounds(bounds);
}

