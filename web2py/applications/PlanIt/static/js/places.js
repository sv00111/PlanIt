var maps;
var marker;
var markers = [];
var planMarker = [];
var infowindows = [];
var startIndex = 0;

function initMap() {
    var san_mat = {lat: 37.566969, lng: -122.326455};
    maps = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: san_mat
    });

    APP.setCenter();
}

function markerMapsZoom(lats, lgns, p_id) {
    maps.setCenter(markers[p_id].getPosition());
    maps.setZoom(15);
    google.maps.event.trigger(markers[p_id], 'click');
}

// Sets the map on all markers in the array.
function setMapOnAll() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function centerMap(locationRec, lat, lng) {
    var center = {lat: (lat), lng: (lng)};
    maps.setCenter(center);
    maps.setZoom(13);
}

function addPermMarkerFromDB(inputArray) {

    for (var i = 0; i < planMarker.length; i++) {
        planMarker[i].setMap(null);
    }
    planMarker = [];
    // cust_lat, cust_lon
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    for (i = 0; i < inputArray.length; i++) {
        var position = {lat: inputArray[i].cust_lat, lng: inputArray[i].cust_lon};
        planMarker[i] = new google.maps.Marker({
            position: position,
            title: inputArray[i].name,
            map: maps,
            icon: image
        });
        maps.setCenter(planMarker[i].getPosition());
        maps.setZoom(15);
    }
}

function addPermMarker(lat, lng) {
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var beachMarker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: maps,
        icon: image
    });
}

var enumerate = function (v) {
    var k = 0;
    return v.map(function (e) {
        e._idx = k++;
    });
};

function deleteMarker(stop_id) {
    planMarker[stop_id].setMap(null);
    planMarker.splice(stop_id, 1);
    // enumerate(planMarker);
}
function clearMarkers(){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function make_Markers(inputArray) {
    console.log(startIndex);
    console.log("length is " + inputArray.length);
    for (var i = startIndex; i < inputArray.length; i++) {
        var contentString = "<h3>" + inputArray[i].name +"</h3>"+
                "<div id= 'infocontent'> " +
                "<p><b>Address: </b>" + inputArray[i].address + "</p>" +
                "<p><b>Phone number: </b>" + inputArray[i].phone_number + "</p>";
        if(inputArray[i].hours[0] != null) {
                 contentString = contentString.concat(
                "<table>" + "<tr><th>" + inputArray[i].hours[0] + "</th></tr>" +
                "<tr><th>" + inputArray[i].hours[1] + "</th></tr>" +
                "<tr><th>" + inputArray[i].hours[2] + "</th></tr>" +
                "<tr><th>" + inputArray[i].hours[3] + "</th></tr>" +
                "<tr><th>" + inputArray[i].hours[4] + "</th></tr>" +
                "<tr><th>" + inputArray[i].hours[5] + "</th></tr>" +
                "<tr><th>" + inputArray[i].hours[6] + "</th></tr>" +
                "</table>" +
                "</div>");
        } else {
            contentString =  contentString.concat("</div>");
        }
        infowindows[i] = new google.maps.InfoWindow({
            content: contentString
        });

        var position = {lat: inputArray[i].lat, lng: inputArray[i].lng};
        console.log("the id of current marker is " + inputArray[i].id);
        console.log("the ith element of current marker is " + i);
        markers[i] = new google.maps.Marker({
            position: position,
            title: inputArray[i].name,
            label: (i + 1).toString(),
            map: maps
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
