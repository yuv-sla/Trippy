// create notifications html phrases to use in the notifications box

import * as utils from "../utils.js";
import { APPROVE_NOTIFICATION_TYPE, DENY_NOTIFICATION_TYPE, CANCEL_NOTIFICATION_TYPE, PENDING_NOTIFICATION_TYPE, SELF_CANCLED_NOTIFICATION_TYPE} from '../fire/fire_notifications.js';



function create_attraction_html(notification_details)
{
  var attraction_page_link = "location.href='attraction_details.html?id=" + notification_details["attraction_id"] + "'";
  var elem = document.createElement("a");
  elem.setAttribute("onclick", attraction_page_link);
  elem.setAttribute("class", "name_att_noti");
  var u_text = document.createElement("u");
  u_text.innerText = notification_details["attraction_name"];
  elem.appendChild(u_text);
  return elem;
}

function create_creator_html(notification_details)
{
  var creator_profile_link = "location.href='profile_view.html?id=" + notification_details["creator_id"] + "'";
  var elem = document.createElement("a");
  elem.setAttribute("onclick", creator_profile_link);
  elem.setAttribute("class", "name_person_noti");
  var u_text = document.createElement("u");
  u_text.innerText = notification_details["creator_full_name"];
  elem.appendChild(u_text);
  return elem;
}


function add_approve_notification_elem(notification_details)
{
  var notification_div = document.createElement("div");
  notification_div.appendChild(create_creator_html(notification_details));
  notification_div.appendChild(document.createTextNode(" approved your request to join "));
  notification_div.appendChild(create_attraction_html(notification_details));

  notification_div.setAttribute("class", "notification");
  notification_div.setAttribute("details", [notification_details["creator_id"], notification_details["creator_full_name"],
                                notification_details["attraction_id"], notification_details["attraction_name"],
                                notification_details["notification_type"]].join(",#"));

  utils.insert_element_before("noti_box", "notifications_insert_before", notification_div);

  var sep = document.createElement("hr");
  
  utils.insert_element_before("noti_box", "notifications_insert_before", sep)

}

function add_deny_notification_elem(notification_details)
{
  var notification_div = document.createElement("div");
  notification_div.appendChild(create_creator_html(notification_details));
  notification_div.appendChild(document.createTextNode(" denied your request to join "));
  notification_div.appendChild(create_attraction_html(notification_details));

  notification_div.setAttribute("class", "notification");
  notification_div.setAttribute("details", [notification_details["creator_id"], notification_details["creator_full_name"],
                                notification_details["attraction_id"], notification_details["attraction_name"],
                                notification_details["notification_type"]].join(","));

  utils.insert_element_before("noti_box", "notifications_insert_before", notification_div);

  var sep = document.createElement("hr");
  
  utils.insert_element_before("noti_box", "notifications_insert_before", sep)
}

function add_cancel_notification_elem(notification_details)
{
  var notification_div = document.createElement("div");
  notification_div.appendChild(create_creator_html(notification_details));
  notification_div.appendChild(document.createTextNode(" canceled your attendance in "));
  notification_div.appendChild(create_attraction_html(notification_details));
  
  notification_div.setAttribute("class", "notification");
  notification_div.setAttribute("details", [notification_details["creator_id"], notification_details["creator_full_name"],
                                notification_details["attraction_id"], notification_details["attraction_name"],
                                notification_details["notification_type"]].join(","));

  utils.insert_element_before("noti_box", "notifications_insert_before", notification_div);
  
  var sep = document.createElement("hr");
  
  utils.insert_element_before("noti_box", "notifications_insert_before", sep)
}

function add_pending_notification_elem(notification_details)
{
  var notification_div = document.createElement("div");
  notification_div.appendChild(create_creator_html(notification_details));
  notification_div.appendChild(document.createTextNode(" requested to join "));
  notification_div.appendChild(create_attraction_html(notification_details));
  
  notification_div.setAttribute("class", "notification");
  notification_div.setAttribute("details", [notification_details["creator_id"], notification_details["creator_full_name"],
                                notification_details["attraction_id"], notification_details["attraction_name"],
                                notification_details["notification_type"]].join(","));
  
  utils.insert_element_before("noti_box", "notifications_insert_before", notification_div);
  
  var sep = document.createElement("hr");
  
  utils.insert_element_before("noti_box", "notifications_insert_before", sep)
}

function add_self_cancel_notification_elem(notification_details)
{
  var notification_div = document.createElement("div");
  notification_div.appendChild(create_creator_html(notification_details));
  notification_div.appendChild(document.createTextNode(" is not going to attend "));
  notification_div.appendChild(create_attraction_html(notification_details));

  notification_div.setAttribute("class", "notification");
  notification_div.setAttribute("details", [notification_details["creator_id"], notification_details["creator_full_name"],
                                notification_details["attraction_id"], notification_details["attraction_name"],
                                notification_details["notification_type"]].join(",#"));
  
  utils.insert_element_before("noti_box", "notifications_insert_before", notification_div);

  var sep = document.createElement("hr");

  utils.insert_element_before("noti_box", "notifications_insert_before", sep)
}

function add_notification_elem(notification_details)
{
  var notification_type = notification_details["notification_type"];
  if (notification_type == APPROVE_NOTIFICATION_TYPE)
  {
    add_approve_notification_elem(notification_details);
  }

  else if(notification_type == DENY_NOTIFICATION_TYPE)
  {
    add_deny_notification_elem(notification_details);
  }

  else if(notification_type == CANCEL_NOTIFICATION_TYPE)
  {
    add_cancel_notification_elem(notification_details);
  }

  else if(notification_type == PENDING_NOTIFICATION_TYPE)
  {
    add_pending_notification_elem(notification_details);
  }

  else if(notification_type == SELF_CANCLED_NOTIFICATION_TYPE)
  {
    add_self_cancel_notification_elem(notification_details)
  }
}

function summed_details_to_dict(summed_details_string)
{
  var summed_details_array = summed_details_string.split(",#");
  var notification_details = {};
  notification_details["creator_id"] = summed_details_array[0];
  notification_details["creator_full_name"] = summed_details_array[1];
  notification_details["attraction_id"] = summed_details_array[2];
  notification_details["attraction_name"] = summed_details_array[3];
  notification_details["notification_type"] = summed_details_array[4];
  return notification_details;
}

export {add_notification_elem, summed_details_to_dict}
