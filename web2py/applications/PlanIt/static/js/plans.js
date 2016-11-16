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
                cust_address: self.vue.form_stop_address,
                parent: self.vue.current_plan.id
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

    function get_plan_from_api(plan_id) {
        var p = {
            plan_id: plan_id
        };
        return get_plan_url + "?" + $.param(p);
    }

    self.get_plan = function() {
        self.vue.plan_id = pid;
        console.log("plan id: " + self.vue.plan_id + " (" + typeof(self.vue.plan_id) + ")");
        if(self.vue.plan_id != -1) {
            $.getJSON(get_plan_from_api(self.vue.plan_id), function(data) {
                self.vue.current_plan = data.plan;
                self.vue.logged_in = data.logged_in;
                console.log("data plan: " + data.plan);
            });
            console.log("current_plan: " + self.vue.current_plan)
        } else {
            var p = {
                label: "No Plan Selected",
                id: -1,
                stops: null
            };
            self.vue.current_plan = p;
            self.vue.logged_in = false;
        }
    };

    function get_stops_from_api(id) {
        var pp = {
            id: id
        };
        return get_stops_url + "?" + $.param(pp);
    }

    self.get_stops = function() {
        $.getJSON(get_stops_from_api(self.vue.plan_id), function(data) {
            self.vue.stops = data.stops;
            self.vue.logged_in = data.logged_in;
            self.vue.stops.sort(sort_by('start_time', false, null));
            enumerate(self.vue.stops);
        })
    };

    self.delete_stop = function(stop_idx) {
        if (confirm("Delete this stop from your plan?")) {
            $.post(del_stop_url,
                { stop_id: self.vue.stops[stop_idx].id },
                function () {
                    self.vue.stops.splice(stop_idx, 1);
                    enumerate(self.vue.stops);
                }
            )
        }
    };

    self.vue = new Vue({
        el: "#vue-plans",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_adding_stop: false,
            logged_in: true,
            plan_id: null,
            current_plan: {},
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
            get_plan: self.get_plan,
        }
    });

    self.get_plan();
    self.get_stops();
    $("#vue-plans").show();

    return self;
};

var PLANAPP = null;

jQuery(function(){PLANAPP = planapp();});
