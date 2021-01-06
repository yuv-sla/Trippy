// Handling checkbox and switches in the customize section of attraction creation

    $('#checkbox').on('change',function(){
        $('.main')[$(this).prop('checked') ? 'fadeIn':'fadeOut']()
    });

function equipmentSwitcher() {
  // Get the checkbox
  var checkBox = document.getElementById("customSwitches");
  // Get the output text
  var text = document.getElementById("switchText");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}

