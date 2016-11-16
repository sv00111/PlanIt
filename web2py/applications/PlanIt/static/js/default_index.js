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

     function get_recommendations_url(start_idx, end_idx) {
        console.log(start_idx)
        console.log(end_idx)
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return recommendations_url + "?" + $.param(pp);
    }

    //Begin by modifying these methods to be vue methods for our app
    self.get_recommendations = function () {
        $.getJSON(get_recommendations_url(0, 20), function (data) {
            self.vue.recommendation = data.recommendation,
            self.vue.has_more = data.has_more,
            self.vue.logged_in = data.logged_in;
            self.vue.next_page = data.next_page;
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
         $.post(get_recommendations,
             {
                 next_page: self.vue.next_page
             },
             function(data) {
                 self.vue.recommendation = data.recommendation
             }

         )
        $.getJSON(get_recommendation_url(num_tracks, num_tracks + 50), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.recommendation, data.recommendation);
        });
    };

    self.searchFn = function(searchRec){
        //create a query with
        query_input = searchRec.replace(" ", "+");
        //url = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=' + query_input + '&key=' + api_key;
        //find way to run query
        console.log(query_input);
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
            searchRec:null,
            next_page: '',
            search_params:'',
            lat: 0,
            lng: 0
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
