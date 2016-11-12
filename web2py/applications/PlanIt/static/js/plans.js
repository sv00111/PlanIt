/**
 * Created by Jordan Zalaha on 11/11/2016.
 */

var planapp = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

    // borrowed from http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
    var sort_by = function(field, reverse, primer){

       var key = primer ?
           function(x) {return primer(x[field])} :
           function(x) {return x[field]};

       reverse = !reverse ? 1 : -1;

       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         }
    };

    self.add_stop_button = function() {
        self.vue.is_adding_stop = !self.vue.is_adding_stop;
        self.vue.form_stop_label = "";
        self.vue.form_stop_start = "";
        self.vue.form_stop_end = "";
        self.vue.form_stop_place = "";
        self.vue.form_stop_address = "";
    };

    self.add_stop = function() {
        $.post(add_stop_url,
            {
                label: self.vue.form_stop_label,
                start_time: self.vue.form_stop_start,
                end_time: self.vue.form_stop_end,
                cust_place: self.vue.form_stop_place,
                cust_address: self.vue.form_stop_address
            },
            function(data) {
                $.web2py.enableElement($("#add_stop_submit"));
                self.add_stop_button();
                self.vue.stops.unshift(data.stop);
                self.vue.stops.sort(sort_by('start_time', false, null));
                enumerate(self.vue.stops);
            }
        );
    };

    function get_stops_from_api(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return get_stops_url + "?" + $.param(pp);
    }

    self.get_stops = function() {
        $.getJSON(get_stops_from_api(0, 10), function(data) {
            self.vue.stops = data.stops;
            self.vue.logged_in = data.logged_in;
            self.vue.stops.sort(sort_by('start_time', false, null));
            enumerate(self.vue.stops);
        })
    };

    self.vue = new Vue({
        el: "#vue-plans",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_adding_stop: false,
            logged_in: true,
            plans: [],
            stops: [],
            label: null,
            date: null,
            start: null,
            end: null,
            loc_lon: null,
            loc_lat: null,
            form_stop_label: null,
            form_stop_start: null,
            form_stop_end: null,
            form_stop_place: null,
            form_stop_address: null,
        },
        methods: {
            add_stop_button: self.add_stop_button,
            add_stop: self.add_stop,
            delete_stop: self.delete_stop,
        }
    });

    self.get_stops();
    $("#vue-plans").show();

    return self;
};

var PLANAPP = null;

jQuery(function(){PLANAPP = planapp();});
