
var maps;
var marker;
function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    maps = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    marker = new google.maps.Marker({
        position: uluru,
        map: maps
    });
}

function initMapss(lats, lngs) {
    marker.setMap(null);
    var position = {lat: lats, lng: lngs};
    // var element = document.getElementById("map");
    // element.HTML = "";
    // // delete element;
    // var map = new google.maps.Map(document.getElementById('map'), {
    //     zoom: 15,
    //     center: position
    // });
    marker = new google.maps.Marker({
        position: position,
        map: maps
    });
    maps.setCenter(marker.getPosition());
    maps.setZoom(15);
}

// // This example requires the Places library. Include the libraries=places
// // parameter when you first load the API. For example:
// // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
//
//
// var app = function() {
//
//     var self = {};
//
//     Vue.config.silent = false; // show all warnings
//
//     // Extends an array
//     self.extend = function(a, b) {
//         for (var i = 0; i < b.length; i++) {
//             a.push(b[i]);
//         }
//     };
//
//     // Enumerates an array.
//     var enumerate = function(v) {
//         var k=0;
//         return v.map(function(e) {e._idx = k++;});
//     };
//
//      function get_recommendations_url(start_idx, end_idx) {
//         console.log(start_idx)
//         console.log(end_idx)
//         var pp = {
//             start_idx: start_idx,
//             end_idx: end_idx
//         };
//         return recommendations_url + "?" + $.param(pp);
//     }
//
//     //Begin by modifying these methods to be vue methods for our app
//     self.get_recommendations = function () {
//         $.getJSON(get_recommendations_url(0, 20), function (data) {
//             self.vue.places = data.recommendation;
//             self.vue.has_more = data.pagetoken != null;
//             self.vue.logged_in = data.logged_in;
//             enumerate(self.vue.places);
//         })
//     };
//
//     self.get_more_info = function () {
//         var num_places = self.vue.places.length;
//         $.getJSON(get_tracks_url(num_tracks, num_tracks + 50), function (data) {
//             self.vue.has_more = data.has_more;
//             self.extend(self.vue.tracks, data.tracks);
//             enumerate(self.vue.tracks);
//         });
//     };
//
//     //convert this to add location
//     // self.add_track_button = function () {
//     //     // The button to add a track has been pressed.
//     //     self.vue.is_adding_track = !self.vue.is_adding_track;
//     // };
//
//     // self.add_track = function () {
//     //     // The submit button to add a track has been added.
//     //     $.post(add_track_url,
//     //         {
//     //             artist: self.vue.form_artist,
//     //             title: self.vue.form_track,
//     //             album: self.vue.form_album,
//     //             duration: self.vue.form_duration
//     //         },
//     //         function (data) {
//     //             $.web2py.enableElement($("#add_track_submit"));
//     //             self.vue.tracks.unshift(data.track);
//     //             enumerate(self.vue.tracks);
//     //         });
//     // };
//
//
//     // self.delete_track = function(track_idx) {
//     //     $.post(del_track_url,
//     //         { track_id: self.vue.tracks[track_idx].id },
//     //         function () {
//     //             self.vue.tracks.splice(track_idx, 1);
//     //             enumerate(self.vue.tracks);
//     //         }
//     //     )
//     // };
//     //
//     // self.select_track = function(track_idx) {
//     //     var track = self.vue.tracks[track_idx];
//     //     self.vue.selected_idx = track_idx;
//     //     self.vue.selected_id = track.id;
//     //     self.vue.selected_url = track.track_url;
//     //     // Shows the uploader if we don't have a track url.
//     //     if (self.vue.selected_url) {
//     //         $("#uploader_div").hide();
//     //     } else {
//     //         // Also sets properly the attribute of the upload form.
//     //         self.upload_url = upload_url + "?" + $.param({track_id: track.id});
//     //         self.delete_file_url = delete_file_url + "?" + $.param({track_id: track.id});
//     //         $("#uploader_div").show();
//     //     }
//     // };
//
//     self.vue = new Vue({
//         el: "#vue-div",
//         delimiters: ['${', '}'],
//         unsafeDelimiters: ['!{', '}'],
//         data: {
//             is_adding_track: false,
//             places: [],
//             logged_in: false,
//             has_more: false,
//             selected_place: '',  // Track selected to play.
//             selected_idx: null,
//             selected_url: null
//         },
//         methods: {
//             get_more_info: self.get_more_info,
//             get_recommendations: self.get_recommendations
//             // add_track_button: self.add_track_button,
//             // add_track: self.add_track,
//             // delete_track: self.delete_track,
//             // select_track: self.select_track
//         }
//
//     });
//
//     self.get_recommendations();
//     console.log(self.vue.places);
//     $("#vue-div").show();
//
//
//     return self;
// };
//
// var APP = null;
//
// // This will make everything accessible from the js console;
// // for instance, self.x above would be accessible as APP.x
// jQuery(function(){APP = app();});
//
//
// var map;
// var placesList;
// var listOfResults;
//
// function initMap() {
//   var pyrmont = {
//     lat: 37.3230,
//     lng: -122.0322
//   };
//
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: pyrmont,
//     zoom: 17
//   });
//
//     var placeID = document.getElementById('places');
//     //console.log(json);
//
//   var service = new google.maps.places.PlacesService(map);
//   service.nearbySearch({
//     location: pyrmont,
//     radius: 500,
//     type: ['store']
//   }, processResults);
// }
// //Everything beneath here can probably get deleted for now
// function processResults(results, status, pagination) {
//   if (status !== google.maps.places.PlacesServiceStatus.OK) {
//     return;
//   } else {
//     createMarkers(results);
//
//     if (pagination.hasNextPage) {
//       var moreButton = document.getElementById('more');
//
//       moreButton.disabled = false;
//
//       moreButton.addEventListener('click', function() {
//         moreButton.disabled = true;
//         pagination.nextPage();
//       });
//     }
//   }
// }
//
// // function getEventTarget(e) {
// //     e = e || window.event;
// //     return e.target || e.srcElement;
// // }
//
// function createMarkers(results) {
//     listOfResults = results;
//     var bounds = new google.maps.LatLngBounds();
//     placesList = document.getElementById('places');
//
//     for (var i = 0, place; place = results[i]; i++) {
//         // var image = {
//         //   url: place.icon,
//         //   size: new google.maps.Size(71, 71),
//         //   origin: new google.maps.Point(0, 0),
//         //   anchor: new google.maps.Point(17, 34),
//         //   scaledSize: new google.maps.Size(25, 25)
//         // };
//
//         // var marker = new google.maps.Marker({
//         //   map: map,
//         //   // icon: image,
//         //   title: place.name,
//         //   position: place.geometry.location
//         // });
//
//
//         //append to a data array.
//         //figure out how to set an olick listner
//         var currentPrice = null;
//         var currentRating = null;
//
//         if (place.price_level != undefined) {
//             currentPrice = place.price_level;
//         }
//         else {
//             currentPrice = 'N/A';
//         }
//
//         if (place.rating != undefined) {
//             currentRating = place.rating;
//         }
//         else {
//             currentRating = "No rating found";
//         }
//
//         // placesList.innerHTML +=
//         //     '<div class="sugg-card" id = "cardId">' +
//         //     '<div class="pull-left">' +
//         //     '<a href="#">' +
//         //     '<img class="imgClass-thumbnail" src="http://3.bp.blogspot.com/-IbEOTNtCMyU/TfCAdHaAxEI/AAAAAAAAA8U/EATib38SSAM/s320/joe-mcelderry.jpg">' +
//         //     '</a>' +
//         //     '</div>' +
//         //     '<div class="sugg-card-body">' +
//         //     '<h2>' + place.name + '</h2>' +
//         //     '<p>' + place.vicinity + '</p>' +
//         //     '</div>' +
//         //     '<div class="sugg-card-footer">' +
//         //     '<span style="display: inline-block; float: left;">' +
//         //     'Price:' + currentPrice +
//         //     '</span>' +
//         //     '<span class="rating">' +
//         //     'Rating: ' + currentRating +
//         //     '</span>' +
//         //     '</div>' +
//         //     '</div>';
//
//         // var temp = place.name;
//         // var divClick  = document.getElementById('cardId');
//         // divClick.onclick = function(event) {
//         //     var target = getEventTarget(event);
//         //     console.log(target);
//         //
//         //     console.log(temp);
//         //
//         // };
//         //
//         //     var placeCard = document.getElementById('cardId');
//         //     google.maps.event.addDomListener(placeCard, 'click', function() {
//         //         console.log("LOLCLOCL");
//         //     });
//
//
//         bounds.extend(place.geometry.location);
//     }
//     // var placeCard = document.getElementsByClassName("sugg-card");
//     // console.log(placeCard);
//     // for (var i = 0; i < placeCard.length; i++) {
//     //     //results array at element i.
//     //     google.maps.event.addDomListener(placeCard[i], 'click', function () {
//     //         console.log("LOLCLOCL" + i);
//     //         console.log(results[i]);
//     //
//     //
//     //     });
//     // }
//
//   map.fitBounds(bounds);
// }
//
