// generate notifications presentation based on the user and his notification in the Firebase db

import {db, getCurrentUserId} from "../fire/fire_basics.js";
import { add_notification_elem, summed_details_to_dict} from './notifications_phrases.js';


function setNotificationCounter(count)
{
  if (count > 0)
  {
    $('#noti_Counter')
      .css({ opacity: 0 })
      .text(count)  // ADD DYNAMIC VALUE (YOU CAN EXTRACT DATA FROM DATABASE OR XML).
      .css({ top: '-10px' })
      .animate({ top: '-2px', opacity: 1 }, 500);
  }

  else
  {
    $('#noti_Counter')
      .css({ opacity: 0 })
      .text(count)  // ADD DYNAMIC VALUE (YOU CAN EXTRACT DATA FROM DATABASE OR XML).
      .css({ top: '-10px' })
      .animate({ top: '-2px', opacity: 0 }, 500);
  }
}

function initNotificationShower()
{
  var user_id = getCurrentUserId();
  var notifications;
  db.collection("Users").doc(user_id).get()
      .then(function(doc)
      {
        if (doc.data()){
          notifications = doc.data().notifications;
          for (var i=notifications.length-1; i >= 0; i--)
          {
            add_notification_elem(notifications[i]);
          }
          setNotificationCounter(notifications.length - parseInt(doc.data().notifications_saw));
        }
      })
}

function actPresented()
{
  if (!(document.getElementById("notifications").getAttribute("deleted")))
  {
    var notifications_elems = document.getElementsByClassName("notification");
    var user_id = getCurrentUserId();
    
    if (notifications_elems.length > 0)
    {
      var notification_details = [];
      for (var i=0; i < notifications_elems.length; i++)
      {
        notification_details.push(summed_details_to_dict(notifications_elems[i].getAttribute("details")));
      }
      
      db.collection("Users").doc(user_id).update(
      {
        notifications_saw: notifications_elems.length
      });

    }
  }
  
}

function presentNotifications()
{
  // TOGGLE (SHOW OR HIDE) NOTIFICATION WINDOW.
  $('#notifications').fadeToggle('fast', 'linear', function () {
    if ($('#notifications').is(':hidden')) { // then not presented yet
      $('#noti_Button').css('background-color', '#ffffff00');
      }

    else // now presented
    {
      $('#noti_Button').css('background-color', '#ffffff00');
      if (!(document.getElementById("notifications").getAttribute("deleted")))
      {
        var notifications_elems = document.getElementsByClassName("notifications");
        if (notifications_elems.length > 0)
        {
          var notification_details = [];
          for (var i=0; i < notifications_elems.length; i++)
          {
            notification_details.push(summed_details_to_dict(notifications_elems.getAttribute("details")));
          }
        }
        var user_id = getCurrentUserId();
      
        db.collection("Users").doc(user_id).update(
        {
          notifications: firebase.firestore.FieldValue.arrayRemoveapply(null, notification_details)
        })
        document.getElementById("notifications").setAttribute("deleted", true);
      }
    }
  $('#noti_Counter').fadeOut('slow');     // HIDE THE COUNTER.

  return false;
     
  });
}

export {initNotificationShower, presentNotifications, actPresented};