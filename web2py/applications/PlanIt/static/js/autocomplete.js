// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var autocomplete;
function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */
      (document.getElementById('no_table_start_location')),
      {types: ['address']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
//  autocomplete.addListener('place_changed', fillInAddress);
}

//
//
// // var autocompletePlan;
// function initAutocompletePlan() {
//   // Create the autocomplete object, restricting the search to geographical
//   // location types.
//   var auto = new google.maps.places.Autocomplete(
//       /** @type {!HTMLInputElement} */
//       (document.getElementById('addressPlan')),
//       {types: ['geocode']}
//   );
//
//   // When the user selects an address from the dropdown, populate the address
//   // fields in the form.
// //  autocomplete.addListener('place_changed', fillInAddress);
// }






// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
