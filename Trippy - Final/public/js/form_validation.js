// checks validation of forms

// use $.fn.one here to fire the event only once.
$(':required').one('blur keydown', function() {
  $(this).addClass('touched');
});
