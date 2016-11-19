// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

     function get_recommendations_url() {
        // console.log(start_idx)
        // console.log(end_idx)
        console.log(self.vue.searchRec)
        console.log(self.vue.locationRec)
        var pp = {
            // start_idx: start_idx,
            // end_idx: end_idx,
            searchRec: self.vue.searchRec.replace(" ", "+"),
            locationRec: self.vue.locationRec.replace(" ", "+"),
            next_page: ''
        };
        return recommendations_url + "?" + $.param(pp);
    }

    //url to run when loading more results
    function get_recommendations_url_more() {
        // console.log(start_idx)
        // console.log(end_idx)
        console.log(self.vue.searchRec)
        console.log(self.vue.locationRec)
        var pp = {
            // start_idx: start_idx,
            // end_idx: end_idx,
            searchRec: self.vue.searchRec.replace(" ", "+"),
            locationRec: self.vue.locationRec.replace(" ", "+"),
            next_page: self.vue.next_page
        };
        return recommendations_url + "?" + $.param(pp);
    }

    //Begin by modifying these methods to be vue methods for our app
    self.get_recommendations = function () {
        $.getJSON(get_recommendations_url(), function (data) {
            self.vue.recommendation = data.recommendation,
            self.vue.has_more = data.has_more,
            self.vue.logged_in = data.logged_in;
            self.vue.next_page = data.next_page;
            self.vue.locationRec = data.location;
            enumerate(self.vue.recommendation);
        })
    };

    // self.get_more = function () {
    //     var num_tracks = self.vue.tracks.length;
    //     $.getJSON(get_tracks_url(num_tracks, num_tracks + 50), function (data) {
    //         self.vue.has_more = data.has_more;
    //         self.extend(self.vue.tracks, data.tracks);
    //     });
    //     self.vue.show_reviewers = false;
    // };

    //this function should be using the newly declared self.vue.next_page variable to run the query
     self.get_more_rec = function () {
          $.getJSON(get_recommendations_url_more(), function (data) {
            self.extend(self.vue.recommendation, data.recommendation);
            self.vue.has_more = data.has_more,
            self.vue.logged_in = data.logged_in;
            self.vue.next_page = data.next_page;
            self.vue.locationRec = data.location;
            // enumerate(self.vue.recommendation);
        })
        //  $.post(recommendations_url,
        //      {
        //          next_page: self.vue.next_page
        //      },
        //      function(data) {
        //          self.vue.recommendation = data.recommendation
        //      }
        //
        //  )
        // $.getJSON(get_recommendation_url(), function (data) {
        //     self.vue.has_more = data.has_more;
        //     self.extend(self.vue.recommendation, data.recommendation);
        // });
    };

    self.searchFn = function(searchRec, locationRec){
        // console.log(searchRec);
        //create a query with
        var query_input = searchRec.replace(" ", "+");
        self.vue.next_page = '';
        self.vue.has_more = false;

        //find way to run query
        // console.log(query_input);
        // console.log(locationRec);
        self.get_recommendations();
    };
//lat and lng will need to be queried from the users first input location.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            recommendation: [],
            logged_in: false,
            has_more: false,
            searchRec:'',
            next_page: '',
            search_params:'',
            lat: 0,
            lng: 0,
            locationRec: ''
        },
        methods: {
            get_more_rec: self.get_more_rec,
            get_recommendations: self.get_recommendations,
            searchFn: self.searchFn
        }

    });

    self.get_recommendations();
    console.log(self.vue.recommendation);
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
