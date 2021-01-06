// datepicker of birthdate

$('input[name="singledpick"]').daterangepicker({
  opens: 'left', // also can be 'right' or 'center'
  autoApply: true,
  locale: {
    format: 'DD/MM/YYYY'
  },
  shortYearCutoff: 1,
  dateFormat: 'dd-mm-yy',
  minDate: "-100Y", 
  maxDate: "moment()",
  yearRange: "1900:2020",
  showDropdowns: true,
  singleDatePicker: true,
});

// init value and place holder
$('input[name="singledpick"]').val('');

// Makes click on calender icon to open the calender
$('#datepicker').click(function (e) {
  e.preventDefault();
   $(this).attr("autocomplete", "off");  
});

