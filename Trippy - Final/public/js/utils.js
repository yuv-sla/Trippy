// Utils functions to be used across project

import {changeImgSrc} from "./fire/fire_basics.js";

const TYPE_TO_IMG = { "cycling": "/assets/attraction_images/cycling.jpg",
                      "cruising" : "/assets/attraction_images/cruising.jpg",
                      "kayaking": "/assets/attraction_images/kayaking.jpg",
                      "jeep" : "/assets/attraction_images/jeep.jpg",
                      "trekking": "/assets/attraction_images/trekking.jpg",
                      "shared ride": "/assets/attraction_images/shared_ride.jpg",
                      "extreme": "/assets/attraction_images/extreme.jpg",
                      "site seeing": "/assets/attraction_images/site_seeing.png",
                      "other": "/assets/attraction_images/other.jpg"
                    }
const DEFAULT_ATTRACTION_IMG_KEY = "other";

function getAttractionImgSrc(attraction_data)
{
  var img_src;
  var lower_type = attraction_data.type.toLowerCase();
  if ((lower_type != "other") && (lower_type in TYPE_TO_IMG))
  {
    img_src = TYPE_TO_IMG[lower_type];
  }
  else
  {
    img_src = TYPE_TO_IMG[DEFAULT_ATTRACTION_IMG_KEY];
  }
  return img_src;
}

// to use the given Dict just call urlParmas.get(key)
function getUrlQueryDict(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}

function isSubstring(text, substr) {
  return text.includes(substr);
}

function isInList(lst, str_to_check) {
  return lst.includes(str_to_check);
}

function american_date_string_to_string(str)
{
  var splitted = str.split("/");
  var date_ob = new Date([splitted[1], splitted[0], splitted[2]].join("/"));
  var day_num = date_ob.getDate();
  var month_name = date_ob.toLocaleString('default', { month: 'long' })
  return month_name + " " + day_num;
}

function date_to_str(date) {
  var day_num, month_name, date_ob;
  date_ob = date.toDate();
  day_num = date_ob.getDate();
  month_name = date_ob.toLocaleString('default', { month: 'long' })
  return month_name + " " + day_num;
}

function get_current_date()
{
  var cur_date = new Date();
  cur_date.setHours(0, 0, 0, 0);
  return cur_date;
}

function extract_date_from_tag(tag_id)
{
  var date_parts_ymd = document.getElementById(tag_id).value.split("/");
  return new Date(date_parts_ymd[2], parseInt(date_parts_ymd[1]) - 1, date_parts_ymd[0]);
}

function dtpicker_start_date(dt_tag_id) {
  var date_range_raw = document.getElementById(dt_tag_id).value;
  return date_range_raw.slice(0, 10);
}

function dtpicker_end_date(dt_tag_id) {
  var date_range_raw = document.getElementById(dt_tag_id).value;
  return date_range_raw.slice(13, 23);
}

function changeInnerText(tag_id, new_val) {
  document.getElementById(tag_id).innerText = new_val;
}

function changeInnerHTML(tag_id, new_val) {
  document.getElementById(tag_id).innerHTML = new_val;
}

function unhide_tags(tags_ids) {
  for (var i = 0; i < tags_ids.length; i++) {
    document.getElementById(tags_ids[i]).setAttribute("style", "display:block;");
  }
}

function fill_imgs_tags(user_doc_id, imgs_basenames, tags_names) {
  for (var i = 0; i < tags_names.length; i++) {
    changeImgSrc(user_doc_id, imgs_basenames[i], tags_names[i]);
  }
}

function getAge(birthDate) 
{
  var today = new Date();
  var nowyear = today.getFullYear();
  var nowmonth = today.getMonth();
  var nowday = today.getDate();

  var birthyear = birthDate.getFullYear();
  var birthmonth = birthDate.getMonth();
  var birthday = birthDate.getDate();

  var age = nowyear - birthyear;
  var age_month = nowmonth - birthmonth;
  var age_day = nowday - birthday;

  if(age_month < 0 || (age_month == 0 && age_day <0))
  {
    age = parseInt(age) -1;
  } 
  return age;
}

function move_element(child_element, new_parent_element)
{
  element.detach().appendTo(new_parent_element);
}

function insert_element_before(parent_elem_tid, insert_before_tid, element_to_insert)
{
  var parent_elem = document.getElementById(parent_elem_tid);
  var insert_before = document.getElementById(insert_before_tid);
  parent_elem.insertBefore(element_to_insert, insert_before);
}

export { getUrlQueryDict, isSubstring, isInList, date_to_str, dtpicker_start_date, dtpicker_end_date,
         changeInnerText, unhide_tags, fill_imgs_tags, extract_date_from_tag,
         american_date_string_to_string, changeInnerHTML, getAttractionImgSrc, get_current_date, insert_element_before, getAge};