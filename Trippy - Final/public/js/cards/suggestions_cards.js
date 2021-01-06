// create cards for attractions suggested

import * as utils from '../utils.js';

function add_suggestion_card(doc_id, img_src, attraction_title, attraction_date_str,
                             parent_elem_tid, insert_before_tid)
{
  var card_div = document.createElement("div");
  var card_ref = "attraction_details.html?id=" + doc_id;
  card_div.setAttribute("class", "card");
  card_div.setAttribute("onclick", "window.location.href =' " + card_ref + "';")

  var img = document.createElement("img");
  img.setAttribute("class", "card_img");
  img.setAttribute("src", img_src);

  var card_title = document.createElement("h2");
  card_title.setAttribute("class", "card_title");
  card_title.innerText = attraction_title;

  var card_date = document.createElement("h3");
  card_date.setAttribute("class", "card_date");
  card_date.innerText = attraction_date_str;

  // combine all together
  card_div.appendChild(img);
  card_div.appendChild(card_title);
  card_div.appendChild(card_date);

  // insert
  var parent = document.getElementById(parent_elem_tid);
  var insert_before = document.getElementById(insert_before_tid);
  parent.insertBefore(card_div, insert_before);
}

function add_suggestion_by_doc(doc_id, data, feed_parent_tid, insert_before_tid) {
  var att_name, start_date, img_src;

  if (doc_id != "example") {
    img_src = utils.getAttractionImgSrc(data);
    att_name = data.name;
    start_date = utils.date_to_str(data.start_date);
    add_suggestion_card(doc_id, img_src, att_name, start_date,
                             feed_parent_tid, insert_before_tid);
  }
}

export {add_suggestion_by_doc};