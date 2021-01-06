// functions for enabling location filter

const LOC_CHECKBOX_ID = "loc_checkbox"
const LOC_HOLDER_ID = "loc_holder"

// the next two are also in distance_calculator. need to unit
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  if (lat1 == "" || lon1 == "" || lat2 == "" || lon2 == "")
  {
    return 1000000;
  }
  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function isCheckboxChecked(checkbox_id)
{
  if($("#" + checkbox_id).prop("checked"))
  {
    return true;
  }
  return false;
}

function uncheckChecbox(checkbox_id)
{
  $('#' + checkbox_id).prop('checked', false);
}

function get_loc()
{
  if(!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
    } 
    else
    {
      navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback_highAccuracy,
      {maximumAge:600000, timeout:5000, enableHighAccuracy: true})
    }; 
}

function errorCallback_highAccuracy(error) {
  if (error.code == error.TIMEOUT)
  {
    navigator.geolocation.getCurrentPosition(
      successCallback, 
      errorCallback_lowAccuracy,
      {maximumAge:600000, timeout:10000, enableHighAccuracy: false});
    return false;
  }  
  var error_holder = document.getElementById(LOC_HOLDER_ID);
  var msg = "Couldn't get your location"
    
  error_holder.innerText = msg;
  error_holder.setAttribute("style", "display: block");
  uncheckChecbox(LOC_CHECKBOX_ID);

}

function errorCallback_lowAccuracy(error) {
    var error_holder = document.getElementById(LOC_HOLDER_ID);
    var msg = "Couldn't get your location"
    
    error_holder.innerText = msg;
    error_holder.setAttribute("style", "display: block");
}

function onSuccessAfterEffect(lat_here, lng_here)
{
  var cards = document.getElementsByClassName("loc");
  for (var i=0; i < cards.length; i++)
  {
    cards[i].setAttribute("distance", getDistanceFromLatLonInKm(lat_here, lng_here, cards[i].getAttribute("latitude"), cards[i].getAttribute("longitude")));
  }
}

function successCallback(position) {
    
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var location_holder = document.getElementById(LOC_HOLDER_ID);
    
    location_holder.setAttribute("style", "display: none");
    location_holder.setAttribute("latitude", latitude);
    location_holder.setAttribute("longitude", longitude);

    $('#radius_selector').prop('disabled', false);
    $('#radius_selector').selectpicker('refresh');

    onSuccessAfterEffect(latitude, longitude);
    return true;
}

$('#radius_selector').prop('disabled', true);

$('#' + LOC_CHECKBOX_ID).click(function () {
  if(isCheckboxChecked(LOC_CHECKBOX_ID))
  {
    get_loc();
  }
  else
  {
    $('#radius_selector').prop('disabled', true);
    $('#radius_selector').selectpicker('refresh');
  }
});