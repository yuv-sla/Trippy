// Create cards for manage tabs (Pending, Going, Organizer)

import {changeImgElemSrc, db} from "../fire/fire_basics.js";
import {approve_pending, deny_pending, cancel_going} from "../fire/fire_manage_db_update.js";
import {add_approve_notification, add_deny_notification, add_cancel_notification} from "../fire/fire_notifications.js"
import {addSingleAvatar, createRawParticipantImg} from "../fire/fire_attraction.js"
import * as utils from "../utils.js";

const JOIN_REQUESTS_PARENT_TID = "join_requests";
const JOIN_REQUESTS_INSERT_BEFORE_TID = "join_requests_insert_before";

const PARTICIPANTS_PARENT_TID = "participants_users";
const PARTICIPANTS_INSERT_BEFORE_TID = "participants_insert_before";
const PARTICIPANTS_CARDS_PARENT_TID = "participants_cards";

const NO_REQUESTS_P_TID = "no_requests_msg";

const REQUESTS_TITLE_TID = "bolded_requests_title";
const PARTICIPANTS_TITLE_TID = "bolded_participants_title";


function syncronize_participants_title()
{
  var participants_title_elem = document.getElementById(PARTICIPANTS_TITLE_TID);
  var total_going = participants_title_elem.getAttribute("total_going");
  var required_amount = participants_title_elem.getAttribute("required_amount")
  participants_title_elem.innerText = "Participants: (" + total_going + " / " + required_amount + ")";
}

function syncronize_requests_layout()
{
  var requests_title_elem = document.getElementById(REQUESTS_TITLE_TID);
  var spots_left = requests_title_elem.getAttribute("spots_left");
  if (spots_left == 1)
  {
    requests_title_elem.innerText = "Join Requests: (1 Spot Left)";
  }
  else
  {
    if (spots_left > 1)
    {
      requests_title_elem.innerText = "Join Requests: (" + spots_left + " Spots Left)";
    }
    else
    {
      var requests_title_elem = document.getElementById(REQUESTS_TITLE_TID);
      requests_title_elem.innerText = "Wait List: Attraction is Full";
    }
  }
}

function handle_requests_text()
{
  var current_requests_amount = document.getElementById(JOIN_REQUESTS_PARENT_TID).getElementsByClassName("card").length;
  if (current_requests_amount == 0)
  {
    utils.unhide_tags([NO_REQUESTS_P_TID]);
  }
}

function get_participants_buttons_div(attraction_id)
{
  var buttons_div = document.createElement("div");
  buttons_div.setAttribute("class", "buttons_container");

  var cancel_button = document.createElement("button");
  cancel_button.setAttribute("class", "cancel");
  cancel_button.innerText = "  X  ";
  cancel_button.setAttribute("onclick", "cancel_participant(this)");
  
  buttons_div.appendChild(cancel_button);
  return buttons_div;
}

function get_join_req_buttons_div(attraction_id)
{
  var buttons_div = document.createElement("div");
  buttons_div.classList = ["buttons_container"];

  var cancel_button = document.createElement("button");
  cancel_button.setAttribute("class", "not_approve");
  cancel_button.innerText = "  X  ";
  cancel_button.setAttribute("onclick", "deny_request(this)");

  var approve_button = document.createElement("button");
  approve_button.setAttribute("class", "approve");
  approve_button.innerText = "  V  ";
  approve_button.setAttribute("onclick", "approve_request(this)");
  
  buttons_div.appendChild(cancel_button);
  buttons_div.appendChild(approve_button);
  return buttons_div;
}

function approve_request(approve_button)
{
  var card_to_move = approve_button.parentNode.parentNode.parentNode;
  var attraction_id = utils.getUrlQueryDict().get("id");
  var approved_user_id = card_to_move.id.split("_")[1];

  approve_pending(attraction_id, approved_user_id);

  add_approve_notification(approved_user_id);

  // get attraction id and user to approve and use db update imported funtion 
  document.getElementById("participants_cards").prepend(card_to_move);
  join_card_to_particip_card(card_to_move);

  var participants_title_elem = document.getElementById(PARTICIPANTS_TITLE_TID);
  var requests_title_elem = document.getElementById(REQUESTS_TITLE_TID);
  
  var old_spots_left = parseInt(requests_title_elem.getAttribute("spots_left"));
  requests_title_elem.setAttribute("spots_left", old_spots_left - 1);

  var old_going_amount = parseInt(participants_title_elem.getAttribute("total_going"));
  participants_title_elem.setAttribute("total_going", parseInt(old_going_amount + 1));

  // add user from main details page
  db.collection("Users").doc(approved_user_id).get().then(function(doc){
  var cur_going_img = createRawParticipantImg(approved_user_id);
  cur_going_img.setAttribute("class", "avatar");
  cur_going_img.setAttribute("title", doc.data().first_name + " " + doc.data().last_name);
  changeImgElemSrc(doc.id, img_basename, cur_going_img);
  addSingleAvatar(cur_going_img);
  var details_participants_amounts = document.getElementById("participants_c");
  var new_going_amount = parseInt(details_participants_amounts.innerText.split(" ")[0]) + 1;
  details_participants_amounts.innerText = new_going_amount + " " + details_participants_amounts.innerText.split(" ").slice(1,).join(" ");
  })

  syncronize_requests_layout();
  syncronize_participants_title();
  handle_requests_text();

  if (old_spots_left <= 1)
  {
        var approve_btns = document.getElementsByClassName("approve");
        for (var i=0; i< approve_btns.length; i++)
        {
          approve_btns[i].disabled = true;
        }
        // show message that there aren't spots left
  }

  return false;
}

function deny_request(deny_button)
{
  var card_to_deny = deny_button.parentNode.parentNode.parentNode;
  var attraction_id = utils.getUrlQueryDict().get("id");
  var denied_user_id = card_to_deny.id.split("_")[1];

  deny_pending(attraction_id, denied_user_id);
  
  add_deny_notification(denied_user_id);

  card_to_deny.remove();
  handle_requests_text();

  return false;
}

function cancel_participant(cancel_button)
{
  var card_to_cancel = cancel_button.parentNode.parentNode.parentNode;

  var attraction_id = utils.getUrlQueryDict().get("id");
  var canceled_user_id = card_to_cancel.id.split("_")[1];

  cancel_going(attraction_id, canceled_user_id);
  add_cancel_notification(canceled_user_id);

  card_to_cancel.remove();

  // remove user img from main details
  document.getElementById("participant_img_" + canceled_user_id).remove();
  var details_participants_amounts = document.getElementById("participants_c");
  var new_going_amount = parseInt(details_participants_amounts.innerText.split(" ")[0]) - 1;
  details_participants_amounts.innerText = new_going_amount + " " + details_participants_amounts.innerText.split(" ").slice(1,).join(" ");

  var participants_title_elem = document.getElementById(PARTICIPANTS_TITLE_TID);
  var requests_title_elem = document.getElementById(REQUESTS_TITLE_TID);
  
  var old_spots_left = parseInt(requests_title_elem.getAttribute("spots_left"));
  requests_title_elem.setAttribute("spots_left", old_spots_left + 1);

  var old_going_amount = parseInt(participants_title_elem.getAttribute("total_going"));
  participants_title_elem.setAttribute("total_going", parseInt(old_going_amount - 1));
  
  var approve_btns = document.getElementsByClassName("approve");
  for (var i=0; i< approve_btns.length; i++)
  {
    approve_btns[i].disabled = false;
  }

  syncronize_requests_layout();
  syncronize_participants_title();

  return false;
}


function add_join_req_card(participant_id, profile_basename, full_name, attraction_id)
{
  var card_div = document.createElement("div");
  card_div.setAttribute("class", "card");
  card_div.setAttribute("id", "card_" + participant_id);

  var content_container = document.createElement("div");
  content_container.setAttribute("class", "container");

  var user_img = document.createElement("img");
  user_img.setAttribute("onclick", "window.location.href='profile_view.html?id=" + participant_id + "'");
  user_img.setAttribute("class", "join_req_img");
  user_img.setAttribute("alt", "Avatar");
  changeImgElemSrc(participant_id, profile_basename, user_img);

  var name_headline = document.createElement("h3");
  name_headline.setAttribute("class", "join_req_name");
  name_headline.innerText = full_name;

  var buttons_div = get_join_req_buttons_div(attraction_id);

  content_container.appendChild(user_img);
  content_container.appendChild(name_headline);
  content_container.appendChild(buttons_div);

  card_div.appendChild(content_container);

  utils.insert_element_before(JOIN_REQUESTS_PARENT_TID, JOIN_REQUESTS_INSERT_BEFORE_TID, card_div);
}

function add_participant_card(participant_id, profile_basename, full_name, attraction_id)
{
  var card_div = document.createElement("div");
  card_div.setAttribute("class", "card");
  card_div.setAttribute("id", "card_" + participant_id);

  var content_container = document.createElement("div");
  content_container.setAttribute("class", "container");

  var user_img = document.createElement("img");
  user_img.setAttribute("class", "particip_img");
  user_img.setAttribute("onclick", "window.location.href='profile_view.html?id=" + participant_id + "'");
  changeImgElemSrc(participant_id, profile_basename, user_img);

  var name_headline = document.createElement("h3");
  name_headline.setAttribute("class", "particip_name");
  name_headline.innerText = full_name;

  var buttons_div = get_participants_buttons_div(attraction_id);

  content_container.appendChild(user_img);
  content_container.appendChild(name_headline);
  content_container.appendChild(buttons_div);

  card_div.appendChild(content_container);

  utils.insert_element_before(PARTICIPANTS_CARDS_PARENT_TID, PARTICIPANTS_INSERT_BEFORE_TID, card_div);
}

function add_organizer_card(organizer_id, profile_basename, full_name, attraction_id)
{
  var card_div = document.createElement("div");
  card_div.setAttribute("class", "card");
  card_div.setAttribute("id", "card_" + organizer_id);

  var content_container = document.createElement("div");
  content_container.setAttribute("class", "container");

  var user_img = document.createElement("img");
  user_img.setAttribute("class", "particip_img"); // maybe change later to ephasize its the organizer
  user_img.setAttribute("onclick", "window.location.href='profile_view.html?id=" + organizer_id + "'");
  changeImgElemSrc(organizer_id, profile_basename, user_img);

  var name_headline = document.createElement("h3");
  name_headline.setAttribute("class", "particip_name");
  name_headline.innerText = full_name;

  content_container.appendChild(user_img);
  content_container.appendChild(name_headline);
  card_div.appendChild(content_container);

  utils.insert_element_before(PARTICIPANTS_CARDS_PARENT_TID, PARTICIPANTS_INSERT_BEFORE_TID, card_div);
}

function join_card_to_particip_card(join_card)
{
  var content_container = join_card.getElementsByClassName("container")[0];
  var user_img = content_container.getElementsByClassName("join_req_img")[0];
  var name_headline = content_container.getElementsByClassName("join_req_name")[0];
  var attraction_id = utils.getUrlQueryDict().get("id");
  content_container.getElementsByClassName("buttons_container")[0].replaceWith(get_participants_buttons_div(attraction_id));
  user_img.setAttribute("class", "particip_img");
  name_headline.setAttribute("class", "particip_name");

}

export {add_join_req_card, add_participant_card, add_organizer_card, PARTICIPANTS_PARENT_TID, JOIN_REQUESTS_PARENT_TID,
        approve_request, deny_request, cancel_participant, NO_REQUESTS_P_TID, handle_requests_text, REQUESTS_TITLE_TID, PARTICIPANTS_TITLE_TID,
        syncronize_participants_title, syncronize_requests_layout};