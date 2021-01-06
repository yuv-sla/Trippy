// fills the profile page with the user's details

import { db, changeImgSrc, initFirebase, getCurrentUserId } from './fire_basics.js'
import * as utils from '../utils.js'

function fillProfilePageTags(user_data, user_doc_id) {
  // fills text fields
  utils.changeInnerText("name", user_data.first_name + ' ' + user_data.last_name);
  utils.changeInnerText("gender_age_h", user_data.gender + ' - ' + user_data.age);
  utils.changeInnerText("lang_h", user_data.languages.join(", "));
  utils.changeInnerText("country_city_h", user_data.country + ' - ' + user_data.city);
  utils.changeInnerText("description", user_data.about);

  // fill profile picture and atmosphere pictures
  utils.fill_imgs_tags(user_doc_id, [user_data.profile_image_name], ["profileImg"]);
  utils.fill_imgs_tags(user_doc_id, user_data.atmosphere_images_names,
    ["atmosphere1", "atmosphere2", "atmosphere3"]);

  utils.unhide_tags(["personal_details", "description", "top_exp_box", "profileImg"]);
}

function initProfilePage() {

  var user_doc_id = utils.getUrlQueryDict().get("id");
  var docRef = db.collection("Users").doc(user_doc_id);
  if (user_doc_id == getCurrentUserId())
  {
    var bottom_btn_a = document.getElementById("a_bottom_profile");
    bottom_btn_a.setAttribute("href", "my_friends.html");
    bottom_btn_a.removeAttribute("target");
    bottom_btn_a.setAttribute("class", "float_friends");
    bottom_btn_a.getElementsByTagName("i")[0].setAttribute("class", "fa fa-users");
    bottom_btn_a.removeAttribute("data-toggle");
    bottom_btn_a.removeAttribute("data-target");

  }
  docRef.get().then((doc) => {
    if (doc.exists) {
      fillProfilePageTags(doc.data(), user_doc_id);
      

    } else {
      console.log("No such document!");
    }

  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
}

export{initFirebase, initProfilePage};