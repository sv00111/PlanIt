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
        // console.log(start_idx)
        // console.log(end_idx)
        console.log(self.vue.searchRec)
        console.log(self.vue.locationRec)
        var pp = {
            searchRec: self.vue.searchRec.replace(" ", "+"),
            locationRec: self.vue.locationRec.replace(" ", "+"),
            next_page: '',
            lengthOfArr: 0
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
            self.vue.recommendation = data.recommendation;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            self.vue.next_page = data.next_page;
            self.vue.locationRec = data.location;
            enumerate(self.vue.recommendation);
        })
    };

    self.changeEditPostId = function (post_id, post_name, rec) {
        // self.vue.is_edit_post = !self.vue.is_edit_post;
        self.vue.editPostId = post_id;
        alert(post_name);
        console.log(rec);
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
            // enumerate(self.vue.recommendation);
        })
    };

    self.searchFn = function (searchRec, locationRec) {
        self.vue.next_page = '';
        self.vue.has_more = false;
        self.vue.recommendation = [];
        self.vue.lat = 0;
        self.vue.lng = 0;
        self.get_recommendations();
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
            loading: 0,
        },
        methods: {
            get_more_rec: self.get_more_rec,
            get_recommendations: self.get_recommendations,
            searchFn: self.searchFn,
            changeEditPostId: self.changeEditPostId
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
jQuery(function () {
    APP = app();
});
