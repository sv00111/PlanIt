/**
 * Created by Jordan Zalaha on 11/11/2016.
 *
 * Script for managing plan objects and their stops through Vue.
 */

var planapp = function () {

    var self = {};
    var temp_lat = null;
    var temp_lon = null;
    var temp_place_id = null;
    var temp_img_url = "http://studiord.com.au/wp-content/uploads/2016/06/placeholder-180x180.jpg";
    Vue.config.silent = false; // show all warnings

    /**
     * Enumerates an array.
     *
     * @param v : the array to be enumerated
     * @returns the array remapped with each element having a key _idx equal to it's index in the array
     */
    var enumerate = function (v) {
        var k = 0;
        return v.map(function (e) {
            e._idx = k++;
        });
    };

    /**
     * Sorts a list of dictionaries by {@param field}
     * borrowed from http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
     *
     * @param field : the field by which to sort the list
     * @param reverse : if true, ascending. descending otherwise
     * @param primer : (optional) function used to prime the data before sorting
     * @returns {Function} : to be passed into sort()
     */
    var sort_by = function (field, reverse, primer) {

        var key = primer ?
            function (x) {
                return primer(x[field])
            } :
            function (x) {
                return x[field]
            };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    };

    /**
     * Handles the event when the "add stop" button is pressed
     * Resets form inputs and flips is_adding_stop boolean
     */
    self.add_stop_button = function () {
        self.vue.is_adding_stop = !self.vue.is_adding_stop;
        self.vue.form_stop_label = "";
        self.vue.form_stop_start = "";
        self.vue.form_stop_end = "";
        self.vue.form_stop_place = "";
        self.vue.form_stop_address = "";

        // as supplied by the browser's 'navigator.geolocation' object.

    };


    //Shrey wrote this:
    self.add_stop_from_location = function (lat, lng, name, address, place_id, placesUrl) {
        // console.log("address passed is " + address);
        self.vue.is_adding_stop = true;
        self.vue.form_stop_address = address;
        self.vue.form_stop_place = name;
        temp_lat = lat;
        temp_lon = lng;
        temp_place_id = place_id;
        temp_img_url = placesUrl;
    };

    /**
     * Post to add_stop_url
     *
     * add_stop_url = URL('api', 'add_stop')
     *      url declared in home.html
     *      function implemented in api.py
     */

    //TODO: if address is put in, then fill backend with lat and lng using google maps api. else keep it empty.
    self.add_stop = function () {
        if (self.vue.form_stop_end < self.vue.form_stop_start) {
            $("#time_error_msg").show();
            $.web2py.enableElement($("#add_stop_submit"));
        } else {
            $.post(add_stop_url,
                {
                    label: self.vue.form_stop_label,
                    start_time: self.vue.form_stop_start,
                    end_time: self.vue.form_stop_end,
                    cust_place: self.vue.form_stop_place,
                    cust_address: self.vue.form_stop_address,
                    parent: self.vue.current_plan.id,
                    place_id: temp_place_id,
                    cust_lat: temp_lat,
                    cust_lon: temp_lon,
                    thumbnail: temp_img_url
                },
                function (data) {                                                // data is echoed back from db after insert
                    $.web2py.enableElement($("#add_stop_submit"));
                    self.add_stop_button();                                     // close the form
                    self.vue.stops.unshift(data.stop);                          // add stop to vue list object
                    self.vue.stops.sort(sort_by('start_time', false, null));    // sort by start time
                    enumerate(self.vue.stops);
                     //TODO: add perm marker using lat and lng here
                    addPermMarker(temp_lat, temp_lon);

                    $("#time_error_msg").hide();
                    temp_lat = null;
                    temp_lon = null;
                    temp_place_id = null;
                    temp_img_url = "http://studiord.com.au/wp-content/uploads/2016/06/placeholder-180x180.jpg";
                }
            );
        }
    };

    /**
     * Call to api to retrieve plan data from db
     *
     * get_plan_url = URL('api', 'get_plan')
     *      url declared in home.html
     *      function implemented in api.py
     *
     * @param plan_id : db id of plan to be retrieved
     * @returns {@type String} "/{get_plan_url}?plan_id=plan_id"
     */
    function get_plan_from_api(plan_id) {
        var p = {
            plan_id: plan_id
        };
        return get_plan_url + "?" + $.param(p);
    }

    /**
     * Populates vue object with selected plan's data retrieved from db via api using plan's id passed through home url
     *
     * {@var pid} declared in home.html, initialized through home() in default.py
     *
     * if {@var pid} is defined call {@function get_plan_from_api()} else use placeholder
     */
    self.get_plan = function () {
        // initAutocomplete();
        $("vue-plans").hide();
        self.vue.plan_id = pid;
        if (self.vue.plan_id != null) {
            $.getJSON(get_plan_from_api(self.vue.plan_id), function (data) {
                self.vue.is_collab = data.is_collab;
                if(self.vue.is_collab) {
                    self.vue.current_plan = data.plan;
                    self.vue.logged_in = data.logged_in;
                } else {
                    window.location.replace(home_url);
                }
            });
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

    /**
     * Call to api to retrieve stop data from db
     *
     * get_stop_url = URL('api', 'get_stop')
     *      url declared in home.html
     *      function implemented in api.py
     *
     * @param id : db id of the plan whose stops we are retrieving
     * @returns {@type String} "/{get_stop_url}?id=id"
     */
    function get_stops_from_api(id) {
        var pp = {
            id: id
        };
        return get_stops_url + "?" + $.param(pp);
    }

    /**
     * Populates vue object with selected plan's stop data retrieved from db via api
     *
     */
    self.get_stops = function () {
        $.getJSON(get_stops_from_api(self.vue.plan_id), function (data) {
            if(self.vue.is_collab) {
                self.vue.stops = data.stops;
                self.vue.logged_in = data.logged_in;
                self.vue.stops.sort(sort_by('start_time', false, null));
                enumerate(self.vue.stops);
                addPermMarkerFromDB(data.stops);
            }
        })
    };

    /**
     * Deletes stop object from database
     *
     * @param stop_idx : stop's index in self.vue.stops
     */
    self.delete_stop = function (stop_idx) {
        if (confirm("Delete this stop from your plan?")) {
            $.post(del_stop_url,
                {stop_id: self.vue.stops[stop_idx].id},
                function () {
                    self.vue.stops.splice(stop_idx, 1);
                    enumerate(self.vue.stops);
                }
            )
        }
    };

    /**
     * Handles event when viewing comments
     * Resets comment string
     */
    self.view_comment_button = function (stop_idx) {
        self.vue.is_viewing_comment = !self.vue.is_viewing_comment;
        console.log(self.vue.is_viewing_comment);
        console.log(stop_idx);
        console.log(self.vue.stops);
        self.vue.stop_id = self.vue.stops[stop_idx].id;
        self.get_comments(self.vue.stop_id);
        self.vue.comment_string = "";
    };

    function get_comments_from_api(id) {
        var pp = {
            id: id
        };
        return get_comments_url + "?" + $.param(pp);
    }

    self.add_comment = function() {
        $.post(add_comment_url,
            {
                comment_string: self.vue.comment_string,
                stop_id: self.vue.current_stop.id
            },
            function (data) {                                                // data is echoed back from db after insert
                $.web2py.enableElement($("#add_stop_submit"));
                self.add_stop_button();                                     // close the form
                self.vue.comments.unshift(data.comment);                          // add stop to vue list object
                self.vue.comments.sort(sort_by('start_time', false, null));    // sort by start time
                enumerate(self.vue.comments);
                $("#time_error_msg").hide();
            }
        );
    };

    /**
     * Populates vue object with selected stop's comment data retrieved from db via api
     *
     */
    self.get_comments = function(stop_idx) {
        $.getJSON(get_comments_from_api(stop_idx), function(data) {
            self.vue.current_stop = data.stops[stop_idx];
            self.vue.comments = data.comments;
            self.vue.comments.sort(sort_by('created_on', false, null));
            enumerate(self.vue.comments);
        })
    };

    /**
     * Gets the db id of the current plan displayed on home
     *
     * @returns self.vue.plan_id if plan_id is not null, null otherwise
     */
    self.getPlanID = function () {
        if (self.vue.plan_id != null) {
            return self.vue.plan_id;
        }
        else return null;
    };

    /**
     * Cascade deletes the current plan and all it's stops
     */
    self.delete_plan = function () {
        if (confirm("Are you sure you want to delete this plan and all of its stops?")) {
            $.post(del_plan_url,
                {plan_id: self.vue.plan_id},
                function () {
                    window.location.replace(home_url);
                }
            )
        }
    };

    self.redirect_share = function(){
        window.location.replace(mail_url + "/" + self.vue.plan_id)
    };



    /**
     * Plans vue object
     *
     * {@dict data}
     *      {@boolean is_adding_stop} :
     *          true if add_stop form is displayed, false otherwise
     *      {@boolean logged_in} :
     *          true if user is logged in with valid Plan-It account when making an api call, false otherwise
     *      {@int plan_id} :
     *          database id of currently selected/displayed plan
     *      {@dict current_plan} :
     *          plan object of currently selected/displayed plan as represented in models/tables.py planit_plan
     *      {@list stops} :
     *          the currently selected plan's list of {@dict stop} objects as represented in models/tables.py
     *          planit_stop
     *
     */
    self.vue = new Vue({
        el: "#vue-plans",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_adding_stop: false,
            is_viewing_comment: false,
            logged_in: true,
            is_collab: false,
            plan_id: null,
            stop_id: null,
            comment_string: '',
            current_plan: {},
            current_stop: {},
            stops: [],
            comments:[],
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
            form_stop_address: null
        },
        methods: {
            add_stop_button: self.add_stop_button,
            add_stop: self.add_stop,
            delete_stop: self.delete_stop,
            get_plan: self.get_plan,
            add_stop_from_location: self.add_stop_from_location,
            delete_plan: self.delete_plan,
            redirect_share: self.redirect_share,
            add_comment: self.add_comment,
            get_comments: self.get_comments,
            view_comment_button: self.view_comment_button
        }
    });

    self.get_plan();
    self.get_stops();
    $("#vue-plans").show();

    return self;
};

var PLANAPP = null;

jQuery(function () {
    PLANAPP = planapp();
});
