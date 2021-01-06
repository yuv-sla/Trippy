// allow duration dropdown to be dynamic

function durationDropdownHandler() {
  // Get the checkbox
  var checkBox = document.getElementById("sel1");
  // Get the output text
  var counter = document.getElementById("ctr1");

  // If the checkbox is checked, display the output text
  if (checkBox.value == "Day/s"){
    $('#ctr1').show();
  } else {
    $('#ctr1').hide();
  }
}