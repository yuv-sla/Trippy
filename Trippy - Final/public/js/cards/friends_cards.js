// create friends/people met cards

import {changeImgElemSrc} from "../fire/fire_basics.js";
import * as utils from "../utils.js";


const FRIENDS_CARDS_PARENT_TID = "friends_feed";
const FRIENDS_INSERT_BEFORE_TID = "friends_feed_insert_before";

function add_friend_card(friend_id, profile_basename, full_name)
{
  var card_div = document.createElement("div");
  card_div.setAttribute("class", "friendCard");
  card_div.setAttribute("onclick", "window.location.href='profile_view.html?id=" + friend_id + "'");
  
  var img_elem = document.createElement("img");
  img_elem.setAttribute("alt", "Avatar");
  img_elem.setAttribute("class", "avatar");
  changeImgElemSrc(friend_id, profile_basename, img_elem);
  
  var name_elem = document.createElement("h2");
  name_elem.setAttribute("class", "friendName");
  name_elem.innerText = full_name; // do full name here

  card_div.appendChild(img_elem);
  card_div.appendChild(name_elem);
  utils.insert_element_before(FRIENDS_CARDS_PARENT_TID, FRIENDS_INSERT_BEFORE_TID, card_div);

}

export {add_friend_card};