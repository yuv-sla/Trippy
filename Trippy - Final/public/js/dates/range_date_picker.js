// picker of dates range for start date choosing in search

$('input[name="from"]').daterangepicker({
  opens: 'left', // also can be 'right' or 'center'
    autoApply: true,
    locale: {
      format: 'DD/MM/YYYY'
    },
    startDate: moment(),
    minDate: moment(),
    linkedCalendars: false
});

   $('input[name="from"]').val('');
   $('input[name="from"]').attr("placeholder"," Range of possible start dates");

$('.datepicker').on('click', function(e) {
   e.preventDefault();
   $(this).attr("autocomplete", "off");  
});