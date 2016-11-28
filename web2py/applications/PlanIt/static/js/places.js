var maps;
var marker;
var markers = [];
var infowindows = [];
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

// Sets the map on all markers in the array.
function setMapOnAll() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function make_Markers(inputArray) {
    console.log(startIndex);
    console.log("length is " + inputArray.length);
    for (var i = startIndex; i < inputArray.length; i++) {
        console.log("running " + i);
        var contentString =  "<h3>" + inputArray[i].name +"</h3>"+
                "<div id= 'infocontent'> " +
            "<p><b>Address: </b>" + inputArray[i].address + "</p>" +
            "<p><b>Phone number: </b>" + inputArray[i].phone_number + "</p>" +
                "<b>Hours</b>" +
            "<table>" + "<tr><th>" + inputArray[i].hours[0] + "</th></tr>" +
            "<tr><th>" + inputArray[i].hours[1] + "</th></tr>" +
            "<tr><th>" + inputArray[i].hours[2] + "</th></tr>" +
            "<tr><th>" + inputArray[i].hours[3] + "</th></tr>" +
            "<tr><th>" + inputArray[i].hours[4] + "</th></tr>" +
            "<tr><th>" + inputArray[i].hours[5] + "</th></tr>" +
            "<tr><th>" + inputArray[i].hours[6] + "</th></tr>" +
            "</table>" +
            "</div>"

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
