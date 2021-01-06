// invokes creating notifications in the Firebase db and retrive them from it
import * as utils from '../utils.js';
import { db, getCurrentUserId} from './fire_basics.js';


const APPROVE_NOTIFICATION_TYPE = "APPROVE";
const DENY_NOTIFICATION_TYPE = "DENY";
const CANCEL_NOTIFICATION_TYPE = "CANCEL";
const PENDING_NOTIFICATION_TYPE = "PENDING";
const SELF_CANCLED_NOTIFICATION_TYPE = "SELF_CANCEL"

function add_notification(notified_id, creator_id, creator_full_name, attraction_id, attraction_name, notification_type)
{
  var notification_key = notifications + "." + creator_id + "_" + attraction_id + "_" + notification_type;
  var notification_value = {"creator_id": creator_id,
                            "creator_full_name": creator_full_name,
                            "attraction_id": attraction_id,
                            "attraction_name": attraction_name,
                            "notification_type": notification_type};
  var full_key = "notifications." + notification_key

  db.collection("Users").doc(notified_id).update(
    {
      notifications: firebase.firestore.FieldValue.arrayUnion(notification_value)
    }
  );
}

// built for attractions_details page layout
function get_using_user_id() // facade
{
  return getCurrentUserId();
}


function get_attraction_organizer_id()
{
  return document.getElementsByClassName("hostAvatar")[0].getAttribute("onclick").split("window.location.href='profile_view.html?id=")[1].slice(0, -1);
}

function get_attraction_organizer_full_name()
{
  return document.getElementsByClassName("hostAvatar")[0].getAttribute("title");
}

function get_attraction_id()
{
  return utils.getUrlQueryDict().get("id");
}

function get_attraction_name()
{
  return document.getElementById("title_txt").innerText;
}

function add_approve_notification(notified_id)
{
  var creator_id, creator_full_name, attraction_id, attraction_name, notification_type
  creator_id = get_attraction_organizer_id();
  creator_full_name = get_attraction_organizer_full_name();
  attraction_id = get_attraction_id();
  attraction_name = get_attraction_name();
  notification_type = APPROVE_NOTIFICATION_TYPE;
  add_notification(notified_id, creator_id, creator_full_name, attraction_id, attraction_name, notification_type);
}

function add_deny_notification(notified_id)
{
  var creator_id, creator_full_name, attraction_id, attraction_name, notification_type
  creator_id = get_attraction_organizer_id();
  creator_full_name = get_attraction_organizer_full_name();
  attraction_id = get_attraction_id();
  attraction_name = get_attraction_name();
  notification_type = DENY_NOTIFICATION_TYPE;
  add_notification(notified_id, creator_id, creator_full_name, attraction_id, attraction_name, notification_type);
}

function add_cancel_notification(notified_id)
{
  var creator_id, creator_full_name, attraction_id, attraction_name, notification_type
  creator_id = get_attraction_organizer_id();
  creator_full_name = get_attraction_organizer_full_name();
  attraction_id = get_attraction_id();
  attraction_name = get_attraction_name();
  notification_type = CANCEL_NOTIFICATION_TYPE;
  add_notification(notified_id, creator_id, creator_full_name, attraction_id, attraction_name, notification_type);
}

function add_pending_notification(notified_id)
{
  var creator_id, creator_full_name, attraction_id, attraction_name, notification_type;

  creator_id = get_using_user_id();
  db.collection("Users").doc(creator_id).get().then(function (doc)
  {
    var data = doc.data();
    creator_full_name = data.first_name + " " + data.last_name;
  })
  .then(function ()
  {
    attraction_id = get_attraction_id();
    attraction_name = get_attraction_name();
    notification_type = PENDING_NOTIFICATION_TYPE;
    add_notification(notified_id, creator_id, creator_full_name, attraction_id, attraction_name, notification_type);
  })
}

function add_self_cancel_notification(notified_id)
{
  var creator_id, creator_full_name, attraction_id, attraction_name, notification_type;

  creator_id = get_using_user_id();
  db.collection("Users").doc(creator_id).get().then(function (doc)
  {
    var data = doc.data();
    creator_full_name = data.first_name + " " + data.last_name;
  })
  .then(function ()
  {
    attraction_id = get_attraction_id();
    attraction_name = get_attraction_name();
    notification_type = SELF_CANCLED_NOTIFICATION_TYPE;
    add_notification(notified_id, creator_id, creator_full_name, attraction_id, attraction_name, notification_type);
  })
}

function get_notifications(uid)
{
  db.collection("Users").doc(uid).get().then(function (doc)
  {
    var data = doc.data();
    return doc.data().notifications;
  })
}


export {add_approve_notification, add_deny_notification, add_cancel_notification, add_pending_notification, add_self_cancel_notification,
        get_attraction_organizer_id, APPROVE_NOTIFICATION_TYPE, DENY_NOTIFICATION_TYPE,
         CANCEL_NOTIFICATION_TYPE, PENDING_NOTIFICATION_TYPE, SELF_CANCLED_NOTIFICATION_TYPE};
