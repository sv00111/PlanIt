// This is the js for the default/index.html view.

var app = function () {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function (a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function (v) {
        var k = 0;
        return v.map(function (e) {
            e._idx = k++;
        });
    };

    function get_recommendations_url() {
        searchRec = self.vue.searchRec.replace(/ /g, "+");
        locationRec = self.vue.locationRec.replace(/ /g, "+");
        next_page = 'none';

        var pidd = PLANAPP.getPlanID();
        if (pidd == null)
            pidd = 0;
        var pp = {
            plan_id: pidd,
            searchRec: searchRec,
            locationRec: locationRec,
            next_page: '',
            lengthOfArr: 0
        };
        return recommendations_url + "?" + $.param(pp);
    }

    //url to run when loading more results
    function get_recommendations_url_more() {
        var pidd = PLANAPP.getPlanID();
        if (pidd == null)
            pidd = 0;
        var pp = {
            plan_id: pidd,
            searchRec: self.vue.searchRec.replace(" ", "+"),
            locationRec: self.vue.locationRec.replace(" ", "+"),
            next_page: self.vue.next_page,
            lengthOfArr: self.vue.recommendation.length
        };
        return recommendations_url + "?" + $.param(pp);
    }

    //Begin by modifying these methods to be vue methods for our app
    self.get_recommendations = function () {
        //start loading function here
        self.vue.loading = 1;
        $.getJSON(get_recommendations_url(), function (data) {
            //end loading function here
            self.vue.loading = 0;
            var invalid = data.invalid;
            self.vue.locationRec = data.location;
            self.vue.lat = data.lat;
            self.vue.lng = data.lng;
            if (!invalid) {
                self.vue.recommendation = data.recommendation;
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
                self.vue.next_page = data.next_page;
                self.vue.invalid = data.invalid;
                enumerate(self.vue.recommendation);
                make_Markers(self.vue.recommendation);
            }else {
                alert("Ya Dun Goofed, Search Again");
            }
            centerMap(data.location,data.lat, data.lng);

        });
    };

    self.changeEditPostId = function (post_id, post_name, lats, lngs, rec) {
        // self.vue.is_edit_post = !self.vue.is_edit_post;
        self.vue.editPostId = post_id;
        //initMapss(lats, lngs);
        markerMapsZoom(lats, lngs, post_id);
    };


    //this function should be using the newly declared self.vue.next_page variable to run the query
    self.get_more_rec = function () {
        self.vue.loading = 1;
        $.getJSON(get_recommendations_url_more(), function (data) {
            self.vue.loading = 0;
            self.extend(self.vue.recommendation, data.recommendation);
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            self.vue.next_page = data.next_page;
            self.vue.locationRec = data.location;
            make_Markers(self.vue.recommendation);
            // enumerate(self.vue.recommendation);
        })
    };

    self.searchFn = function (searchRec, locationRec) {
        setMapOnAll();
        self.vue.locationRec = locationRec;
        self.vue.next_page = '';
        self.vue.has_more = false;
        self.vue.recommendation = [];
        self.vue.lat = 0;
        self.vue.lng = 0;
        clearMarkers();
        self.get_recommendations();
        //self.init();

    };

    self.add = function(lat, lng, name, address, place_id, placesUrl){
        PLANAPP.add_stop_from_location(lat, lng, name, address, place_id, placesUrl);
    };

    self.setCenter = function(){

        centerMap(self.vue.locationRec, self.vue.lat, self.vue.lng);
    };
//lat and lng will need to be queried from the users first input location.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            editPostId: null,
            is_edit_post: false,
            recommendation: [],
            logged_in: false,
            has_more: false,
            searchRec: '',
            next_page: '',
            search_params: '',
            lat: 0,
            lng: 0,
            locationRec: '',
            markers: [],
            infowindows: [],
            loading: 0,
        },
        methods: {
            get_more_rec: self.get_more_rec,
            get_recommendations: self.get_recommendations,
            searchFn: self.searchFn,
            changeEditPostId: self.changeEditPostId,
            add: self.add,
            setCenter: self.setCenter
        }

    });

    self.get_recommendations();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
});

