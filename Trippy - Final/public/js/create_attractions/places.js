// activate google places autocomplete for location choosing

import * as utils from '../utils.js';

let autocomplete;

function initAutocomplete() {
  $(document).ready(function () {
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('Leaving_from')), {
      types: ['geocode']
    });

  autocomplete.addListener('place_changed', fillInAddress);
  });
}

function fillInAddress() {
  var place = autocomplete.getPlace().geometry.location;
  utils.changeInnerText("latitude", place.lat()); // place latitude
  utils.changeInnerText("longitude", place.lng()); // place longitude

  console.log(document.getElementById('Leaving_from').value); // place name
}

export{initAutocomplete};