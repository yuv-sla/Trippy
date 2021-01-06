// This file handles the creation of an attraction details page, using info from firebase database

import * as utils from '../utils.js';
import {db, changeImgElemSrc, getCurrentUserId} from "./fire_basics.js";
import {add_pending_notification, get_attraction_organizer_id} from "./fire_notifications.js";

const PROFILE_PAGE_NAME = "profile_view.html"
const AVATARS_DIV_TID = "avatarsDiv";
const AVATARS_INSERT_BEFORE_TID = "insertAvatarsBefore";

function addToPending()
{
  var attraction_id = utils.getUrlQueryDict().get("id");
  var cur_user_id = getCurrentUserId();
  db.collection("Attractions").doc(attraction_id).update(
    {
      users_pending: firebase.firestore.FieldValue.arrayUnion(cur_user_id),
    }
  )
  .then(function()
  {
    add_pending_notification(get_attraction_organizer_id());
    
    var action_btn = document.getElementById("join_btn");
    action_btn.innerText = "Cancel My Request To Join";
    action_btn.setAttribute("onclick", "self_deny_pending('" + attraction_id + "', '" + getCurrentUserId() + "')");
  
    $('#myModal').on('shown.bs.modal', function(){
    action_btn.setAttribute("data-target", "#myModal3");
    });
  })
}

function createRawParticipantImg(participant_id)
{
  var img_elem = document.createElement("img");
  img_elem.setAttribute("alt", "Avatar");
  img_elem.setAttribute("style", '"object-fit: cover"');
  img_elem.setAttribute("onclick", "window.location.href='" + PROFILE_PAGE_NAME + '?id=' 
                                    + participant_id +"'");
  img_elem.setAttribute("id", "participant_img_" + participant_id);
  return img_elem;
}

function createGoingImgElem(going_user_id)
{
  var goingImgElem;
  db.collection("Users").doc(going_user_id).get().then(function(doc)
  {
    var img_basename = doc.data().profile_image_name;
    goingImgElem = createRawParticipantImg(host_user_id);
    goingImgElem.setAttribute("class", "avatar");
    changeImgElemSrc(going_user_id, img_basename, goingImgElem);
  })
  return goingImgElem;
}

function addSingleAvatar(avatar_elem)
{
  var parent_div = document.getElementById(AVATARS_DIV_TID);
  var insert_before = document.getElementById(AVATARS_INSERT_BEFORE_TID);
  parent_div.insertBefore(avatar_elem, insert_before);
}

function addParticipantsAvatars(host_user_id, going_users_ids)
{
  var cur_going_img;
  var cur_user_id
  var host_img;
  db.collection("Users").doc(host_user_id).get().then(function(doc)
  {
    var data = doc.data();
    var img_basename = data.profile_image_name;
    var full_name = data.first_name + " " + data.last_name;
    host_img = createRawParticipantImg(host_user_id);
    host_img.setAttribute("class", "hostAvatar");
    host_img.setAttribute("title", full_name);
    changeImgElemSrc(host_user_id, img_basename, host_img);
    addSingleAvatar(host_img);  
  }).then(function(t)
  {
    for(var i=0; i< going_users_ids.length; i++)
    {
      cur_user_id = going_users_ids[i];
      db.collection("Users").doc(cur_user_id).get().then(function(doc)
      {
        var data = doc.data();
        var img_basename = data.profile_image_name;
        var full_name = data.first_name + " " + data.last_name;
        cur_going_img = createRawParticipantImg(cur_user_id);
        cur_going_img.setAttribute("class", "avatar");
        cur_going_img.setAttribute("title", full_name);

        changeImgElemSrc(doc.id, img_basename, cur_going_img);
        addSingleAvatar(cur_going_img);  
      })
    }
  })
}


function fillAttPage(att_data) {

  utils.changeInnerText("title_txt", att_data.name); // attraction name

  utils.changeInnerText("start_date_c", utils.date_to_str(att_data.start_date)); // start date

  utils.changeInnerText("duration_c", att_data.duration); // duration

  utils.changeInnerText("expected_expense_c", att_data.cost + att_data.currency); // expected expense

  utils.changeInnerText("leaving_from_c", att_data.leaving_from); // leaving from

  utils.changeInnerText("description_c", att_data.description); // description

  utils.changeInnerText("tags_c", att_data.tags.join(", ")); // tags

  utils.changeInnerText("equipment_c", att_data.equipment); // equipment

  var att_img_src = utils.getAttractionImgSrc(att_data); // change title img
  document.getElementById("title_image").setAttribute("src", att_img_src);
  
  
  // adds participants avatars
  addParticipantsAvatars(att_data.user_organizer, att_data.users_going);

  // participants spots
  utils.changeInnerText("participants_c", att_data.going_amount + " out of " + att_data.required_amount);

  if (att_data.going_amount == att_data.required_amount)
  {
    utils.changeInnerText("join_btn", "Join The Wait List"); // if the attraction is full
  }


  // after all insertions were finished unhide
  utils.unhide_tags(["tab_content", "title_txt", "title_image"]);
  document.getElementById("title_txt").setAttribute("style",
  "position: relative; transition: none 0s ease 0s; cursor: move; bottom:120px; color: white; display: block; z-index:10;")
}

function initAttractionPage() {
  var att_doc_id = utils.getUrlQueryDict().get("id");
  var docRef = db.collection("Attractions").doc(att_doc_id);

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("getAttID in exists");
      fillAttPage(doc.data());
    }
    else {
      console.log("No such document!");
      }
    }).catch(function (error) {
    console.log("Error getting document:", error);
    });
  }

  export{initAttractionPage, addToPending, addSingleAvatar, createRawParticipantImg};