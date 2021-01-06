// Create attractions cards

import * as utils from '../utils.js';


function createIconsDiv(is_loved) {
  var icons_div = document.createElement("div");
  icons_div.setAttribute("class", "heart-empty");

  var heart_icon = document.createElement("i");
  heart_icon.setAttribute("onclick", "changeOfHeart(this)");
  if (is_loved)
  {
    heart_icon.setAttribute("class", "heart fa fa-heart");  
  }
  else
  {
    heart_icon.setAttribute("class", "heart fa fa-heart-o");
  }

  var share_icon = document.createElement("i");
  share_icon.setAttribute("class", "fa fa-share-alt");
  share_icon.setAttribute("aria-hidden", "true");

  icons_div.appendChild(heart_icon);
  icons_div.appendChild(share_icon);

  return icons_div;
}

function createCardImg(img_src) {
  var card_img = document.createElement("img");
  card_img.setAttribute("src", img_src);
  card_img.setAttribute("class", "avatar");
  card_img.setAttribute("alt", "Avatar");

  return card_img;

}

function createStatusDiv(status)
{
  var status_div = document.createElement("div");
  status_div.setAttribute("class", "statusDiv");
  if (status != "")
  {
    var img_status = document.createElement("img");
    img_status.setAttribute("class", status);
    img_status.setAttribute("src", "assets/icons/" + status + "Icon.svg");
    status_div.appendChild(img_status);
  }
  return status_div;
  
}

function createCardHeader(attraction_name, doc_id) {
  var card_header = document.createElement("div");
  card_header.setAttribute('class', 'card-header');
  card_header.setAttribute("onclick", "location.href='attraction_details.html?id=" + doc_id + "'");

  var title_elem = document.createElement("h4");
  title_elem.setAttribute("class", "attraction_title");
  var title_text = document.createTextNode(attraction_name);
  title_elem.appendChild(title_text);

  card_header.appendChild(title_elem);

  return card_header;
}

function createCardContainer(start_date, duration, cost, cur_going, req_attendees, doc_id) {
  var inner_html;
  var card_container = document.createElement("div");
  card_container.setAttribute("class", "card-container");
  card_container.setAttribute("onclick", "location.href='attraction_details.html?id=" + doc_id + "'");

  var card_content = document.createElement("p");
  card_content.setAttribute("class", "attraction_info");

  inner_html = start_date + "<br>" + duration + " <br>" + cost +
      " <br>" + cur_going + " out of " + req_attendees;
  
  card_content.innerHTML = inner_html;
  card_container.appendChild(card_content);
  return card_container;
}

function addCard(img_src, attraction_name, start_date, duration, cost,
  cur_going, req_attendees, lat, lng, doc_id, is_loved, user_status, feed_parent_tid, insert_before_tid) { 
  var card_div = document.createElement("div");
  card_div.setAttribute('class', 'card');
  
  // add longitude latitude attributes to the attraction card
  card_div.setAttribute("latitude", lat);
  card_div.setAttribute("longitude", lng);

  var card_img = createCardImg(img_src);
  var card_header = createCardHeader(attraction_name, doc_id);
  var card_container = createCardContainer(start_date, duration, cost,
    cur_going, req_attendees, doc_id);
  var icons_div = createIconsDiv(is_loved);
  var status_div = createStatusDiv(user_status);

  card_div.appendChild(card_img);
  card_div.append(card_header);
  card_div.append(card_container);
  card_div.appendChild(icons_div);
  card_div.append(status_div);


  // take care of where to insert before
  var element = document.getElementById(feed_parent_tid);
  var child = document.getElementById(insert_before_tid);
  element.insertBefore(card_div, child);
}

function get_status(data, cur_user_id)
{
  if (cur_user_id == "")
  {
    return ""; // for case of a guest
  }
  if (data.user_organizer == cur_user_id)
  {
    return "organizing";
  }
  else if(data.users_going.includes(cur_user_id))
  {
    return "going";
  }
  else if(data.users_pending.includes(cur_user_id))
  {
    return "pending";
  }
  else
  {
    return "";
  }
}

function add_card_by_doc(doc_id, data, cur_user_id, is_loved, feed_parent_tid, insert_before_tid) {
  var att_name, cost, cur_going, req_attendees, start_date, duration, is_loved, user_status, img_src, lat, lng;

  if (doc_id != "example") {
    att_name = data.name;
    cost = data.cost + " " + data.currency;
    cur_going = data.going_amount;
    req_attendees = data.required_amount;
    
    start_date = utils.date_to_str(data.start_date);
    duration = data.duration;
    user_status = get_status(data, cur_user_id);

    img_src = utils.getAttractionImgSrc(data);

    lat = data.coordinats.latitude;
    lng = data.coordinats.longitude;

    
    addCard(img_src, att_name, start_date, duration, cost,
      cur_going, req_attendees, lat, lng, doc_id, is_loved, user_status, feed_parent_tid, insert_before_tid);
  }
}

export{add_card_by_doc};