// choose single date for attraction creation

$('input[name="singledpick"]').daterangepicker({
  opens: 'left', // also can be 'right' or 'center'
  autoApply: true,
  locale: {
    format: 'DD/MM/YYYY'
  },
  startDate: moment(),
  minDate: moment(),
  singleDatePicker: true,
});

// init value and place holder
$('input[name="singledpick"]').val('');

// Makes click on calender icon to open the calender
$('.glyphicon-calendar').click(function (event) {
  event.preventDefault();
  $('#frmSaveOffice_startdt').click();
});