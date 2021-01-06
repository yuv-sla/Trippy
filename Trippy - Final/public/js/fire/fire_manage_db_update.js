// methods to preform the updates to firebase db caused by the managed tab

import {db} from "./fire_basics.js";
import {add_self_cancel_notification} from "./fire_notifications.js";
import * as utils from '../utils.js';



function approve_pending(attraction_id, pending_user_id)
{
  db.collection("Attractions").doc(attraction_id).update(
    {
      users_pending: firebase.firestore.FieldValue.arrayRemove(pending_user_id),
      users_going: firebase.firestore.FieldValue.arrayUnion(pending_user_id),
      spots_left: firebase.firestore.FieldValue.increment(-1),
      going_amount: firebase.firestore.FieldValue.increment(1)
      
    }
  );
}

function deny_pending(attraction_id, going_user_id)
{
  db.collection("Attractions").doc(attraction_id).update(
    {
      users_pending: firebase.firestore.FieldValue.arrayRemove(going_user_id)
    }
  );
}

function self_deny_pending(attraction_id, going_user_id)
{
  deny_pending(attraction_id, going_user_id);
  var cur_going, required_going;
  [cur_going, required_going] = document.getElementById("participants_c").innerText.split(" out of");
  
  if (parseInt(cur_going) < parseInt(required_going))
  {
     utils.changeInnerText("join_btn", "I wanna Join");
  }
  else
  {
    utils.changeInnerText("join_btn", "Join The Wait List"); // if the attraction is full
  }
  var action_btn = document.getElementById("join_btn");
  action_btn.setAttribute("onclick", "addToPending()");
  
  $('#myModal3').on('shown.bs.modal', function(){
    action_btn.setAttribute("data-target", "#myModal");
  });

}

function cancel_going(attraction_id, going_user_id)
{
  db.collection("Attractions").doc(attraction_id).update(
    {
      users_going: firebase.firestore.FieldValue.arrayRemove(going_user_id),
      spots_left: firebase.firestore.FieldValue.increment(1),
      going_amount: firebase.firestore.FieldValue.increment(-1)
    }
  );
}

function self_cancel_going(attraction_id, going_user_id)
{
  cancel_going(attraction_id, going_user_id);

  add_self_cancel_notification(going_user_id);

  var participants_holder = document.getElementById("participants_c");
  var current_going = parseInt(participants_holder.innerText.split(" out of")[0]);
  participants_holder.innerText = [current_going - 1, " out of" ,participants_holder.innerText.split(" out of")[1]].join("");

  document.getElementById("participant_img_" + going_user_id).remove();

  var action_btn = document.getElementById("join_btn");
  action_btn.innerText = "I wanna Join";
  action_btn.setAttribute("onclick", "addToPending()");
  
  $('#myModal4').on('shown.bs.modal', function(){
    action_btn.setAttribute("data-target", "#myModal");
  });

}

export {approve_pending, deny_pending, cancel_going, self_deny_pending, self_cancel_going};
