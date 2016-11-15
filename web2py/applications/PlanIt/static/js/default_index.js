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

    function get_tracks_url(start_idx, end_idx) {

        console.log(start_idx)
        console.log(end_idx)
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return tracks_url + "?" + $.param(pp);
    }


     function get_recommendation_url(start_idx, end_idx) {
        console.log(start_idx)
        console.log(end_idx)
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return recommendation_url + "?" + $.param(pp);
    }


    self.get_tracks = function () {
        $.getJSON(get_recommendation_url(0, 20), function (data) {
            self.vue.recommendation = data.recommendation;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
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

     self.get_more_rec = function () {
        var num_tracks = self.vue.recommendation.length;
        $.getJSON(get_recommendation_url(num_tracks, num_tracks + 50), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.recommendation, data.recommendation);
        });
    };

    self.searchFn = function(searchRec){
        console.log(searchRec);
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            recommendation: [],
            tracks:[],
            logged_in: false,
            has_more: false,
            searchRec:null
        },
        methods: {
            get_more_rec: self.get_more_rec,
            searchFn: self.searchFn
        }

    });

    self.get_tracks();
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
