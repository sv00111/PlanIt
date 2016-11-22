var maps;
var marker;
var markers = [];
var startIndex = 0;

function initMap() {
    var san_mat = {lat: 37.566969, lng: -122.326455};
    maps = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: san_mat
    });
    // marker = new google.maps.Marker({
    //     position: uluru,
    //     map: maps
    // });
}

function markerMapsZoom(lats, lgns, p_id) {
    //use p_id to highlight the marker for onclick listner thing
    maps.setCenter(markers[p_id].getPosition());
    maps.setZoom(15);
    google.maps.event.trigger(markers[p_id], 'click');
}
function make_Markers(inputArray, start, end) {
    // marker;
    var infowindows = [];
    console.log("length is " + inputArray.length);
    for (var i = startIndex; i < inputArray.length; i++) {
        console.log("running " + i);
        infowindows[i] = new google.maps.InfoWindow({
            content: 'hi there'
        });

        var position = {lat: inputArray[i].lat, lng: inputArray[i].lng};
        console.log("the id of current marker is " + inputArray[i].id);
        console.log("the ith element of current marker is " + i);
        markers[i] = new google.maps.Marker({
            position: position,
            title: inputArray[i].name,
            label: (i + 1).toString(),
            map: maps,
        });

        google.maps.event.addListener(markers[i], 'click', function (innerKey) {
            return function () {
                infowindows[innerKey].open(maps, markers[innerKey]);
            }
        }(i));
        maps.setCenter(markers[i].getPosition());
        maps.setZoom(15);
    }
}
