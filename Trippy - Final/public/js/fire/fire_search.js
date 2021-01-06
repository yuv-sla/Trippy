import * as utils from '../utils.js';
import { getDistanceFromLatLonInKm} from '../distance_filter/distance_calculator.js';
import { db, getCurrentUserId, isGuestUser, update_last_search} from './fire_basics.js';
import {add_card_by_doc} from '../cards/attractions_cards.js';


const RESULTS_FEED_PAGE_PATH = "search_results.html";
const SEARCH_MAIN_FIELD_TID = "AttractionName";
const SEARCH_NEEDED_SPOTS_TID = "neededspots";
const SEARCH_DATE_RANGE_TID = "datesrange";
const FEED_PARENT_TID = "serach_results_feed";
const INSERT_BEFORE_TID = "end_feed";

function datestring_to_date(date_string)
{
    var date_parts_ymd = date_string.split("/");
    return new Date(date_parts_ymd[2], parseInt(date_parts_ymd[1]) - 1, date_parts_ymd[0]);
}

function update_search_headlines()
{
  var details;
  var url_params = utils.getUrlQueryDict();
  var mindate_str = utils.american_date_string_to_string(url_params.get("mindate"));
  var maxdate_str = url_params.get("maxdate");
  var spots_str = url_params.get("spots");
  if (parseInt(spots_str) > 1)
  {
    spots_str += " persons";
  }
  else
  {
    spots_str += " person";
  }
  if (maxdate_str != "")
  {
    details = mindate_str + " - " + utils.american_date_string_to_string(maxdate_str) +
              "<br>" + spots_str;
  }
  else
  {
    details = mindate_str + " And Further <br>" + spots_str;
  }
  utils.changeInnerText("search-main", url_params.get("search"));
  utils.changeInnerHTML("search-details", details);
  utils.unhide_tags(["search-main", "search-details"]);
}

function filter_inenough_spots(docs, spots)
{
  for (var i = docs.length-1; i>= 0;  i--) 
  {
    if (docs[i]["data"].spots_left < spots)
    {
      docs.splice(i, 1);
    }
  }
  return docs;
}

function get_search_relevant_fields(docs) {
  var d = {};
  var cur_doc_data;
  d["name"] = [];
  d["leaving_from"] = [];
  d["tags"] = [];
  d["type"] = [];
  for (var i = 0; i < docs.length; i++) 
  {
    cur_doc_data = docs[i]["data"];
    d["name"].push(cur_doc_data.name.toLowerCase());
    d["leaving_from"].push(cur_doc_data.leaving_from.toLowerCase());
    d["tags"].push(cur_doc_data.tags.join(" ").toLowerCase());
    d["type"].push(cur_doc_data.type.toLowerCase())
  }
  return d;
}

function remove_unmatched_results(all_docs, search_main_input, spots) {
  all_docs = filter_inenough_spots(all_docs, spots);
  if (search_main_input != '' && search_main_input) {
    search_main_input = search_main_input.toLowerCase();
    var filter_data_dict = get_search_relevant_fields(all_docs);
    var is_name_substr, is_location_substr, is_in_tags, is_type;
    for (var i = filter_data_dict["name"].length-1; i >= 0; i--) {
      is_name_substr = utils.isSubstring(filter_data_dict["name"][i], search_main_input);
      is_location_substr = utils.isSubstring(filter_data_dict["leaving_from"][i], search_main_input);
      is_in_tags = utils.isInList(filter_data_dict["tags"][i], search_main_input);
      is_type = filter_data_dict["type"][i] == search_main_input;

      if (!(is_name_substr) && !(is_location_substr) && !(is_in_tags) && !(is_type)) {
        all_docs.splice(i, 1);
      }
    }
  }
  return all_docs;
}

function map_doc_details(doc) {
  var d = {};
  d["data"] = doc.data();
  d["id"] = doc.id;
  return d;
}

function goToSearchResults() {
  var min_date_arg, max_date_arg, spots_needed_arg, main_input_arg;
  if (document.getElementById(SEARCH_DATE_RANGE_TID).value == '') {
    min_date_arg = moment().format("DD/MM/YYYY");
    max_date_arg = "";
  }
  else {
    min_date_arg = utils.dtpicker_start_date(SEARCH_DATE_RANGE_TID);
    max_date_arg = utils.dtpicker_end_date(SEARCH_DATE_RANGE_TID);
  }

  spots_needed_arg = document.getElementById(SEARCH_NEEDED_SPOTS_TID).valueAsNumber;
  main_input_arg = document.getElementById(SEARCH_MAIN_FIELD_TID).value;
  var is_guest = isGuestUser();
  if(!is_guest)
  {
    update_last_search(main_input_arg, spots_needed_arg, min_date_arg, max_date_arg)
  }

  window.location.href = RESULTS_FEED_PAGE_PATH + "?search=" + main_input_arg + "&spots=" +
  spots_needed_arg + "&mindate=" + min_date_arg + "&maxdate=" + max_date_arg;
}

function getBasicSearchQref() {
  var url_params = utils.getUrlQueryDict();
  var qref = db.collection('Attractions').where('start_date', '>=',
                                                datestring_to_date(url_params.get("mindate")));
  if (url_params.get("maxdate") != "") {
    qref = qref.where("start_date", "<=", datestring_to_date(url_params.get("maxdate")));
  }
  return qref.orderBy("start_date");
}

/** this function applies the basic search */
function applyBasicSearch()
{
  var user_all_loved, att_doc_id, att_data, is_att_loved, cur_user_id, num_of_results;
  var is_guest = isGuestUser();
  if(is_guest)
  {
    cur_user_id = "1";
    user_all_loved = [];
  }
  else
  {
    cur_user_id = getCurrentUserId();
  }
  db.collection("Users").doc(cur_user_id).get().then(function (user_doc) {
    if (user_doc.data()){
    user_all_loved = user_doc.data().loved;
    }
  })
  .catch(function(err){})
  .then(function(t)
  {
    getBasicSearchQref().get().then(snapshot => snapshot.docs.map((doc) => map_doc_details(doc)))
    .then(function (all_docs){
        var spots = parseInt(utils.getUrlQueryDict().get("spots"));
        var search_arg = utils.getUrlQueryDict().get("search");
        all_docs = remove_unmatched_results(all_docs, search_arg, spots);
        num_of_results = all_docs.length;

        for(var i=0; i<all_docs.length; i++)
        {
          var att_doc_id = all_docs[i]["id"];
          var att_data = all_docs[i]["data"];
          if (user_all_loved.includes(att_doc_id))
          {
            is_att_loved = true;
          }
          else
          {
            is_att_loved = false;
          }

          add_card_by_doc(att_doc_id, att_data, cur_user_id, is_att_loved,
                          FEED_PARENT_TID, INSERT_BEFORE_TID);  
        }
        if (num_of_results != 1)
        {
          utils.changeInnerText("resultsNum", num_of_results + " results were found");
        }
        else
        {
          utils.changeInnerText("resultsNum", num_of_results + " result was found");
        }
    })
  });
}

/** this function extracts the card details and returns an array containing dictionaries with the details of each card */
function getCardDetails()
{
  var cards_array, src, src_split, info, info_split, p_str, type, participants, days, price, i, card_lat, card_long, str_price;
  var card_details = {};
  var all_details = [];
  cards_array = document.getElementsByClassName("card");
  for (i = 0; i < cards_array.length; i ++)
  {
    src = cards_array[i].getElementsByTagName("img")[0].getAttribute("src");
    src_split = src.split(".")[0].split("/");
    type = src_split[src_split.length - 1]; //event type
    info = cards_array[i].getElementsByTagName("p")[0].innerHTML; 
    info_split = info.split("<br>");
    p_str = info_split[info_split.length -1].split(" ");
    participants =  parseInt(p_str[p_str.length - 1]); //total number of paricipants
    if (info.includes("Half A Day") || info.includes("Few Hours"))
    {
      days = 1;
    }
    else
    {
      days = parseInt(info_split[1].split(" ")[0]); // number of days stated
    } 
    str_price = info_split[2].split(" ")[0];
    if (str_price == "" || str_price == "NaN") // if no price was entered
    {
      price = 0;
    }
    else
    {
      price = parseFloat(str_price);
    }
    card_lat = parseFloat(cards_array[i].getAttribute("latitude"));
    card_long = parseFloat(cards_array[i].getAttribute("longitude"));
    card_details = {"type": type, "price": price, "days": days, "participants": participants, "latitude": card_lat, "longitude": card_long};
    all_details.push(card_details);
  }
return all_details;
}

/**this function returns the chosen type labels for the event filter */
function get_chosen_types()
{
  var i;
  var types = document.getElementsByTagName("label");
  var chosen_types = [];
  for (i = 0; i < types.length -1 ; i ++)
  {
    if (!($(types[i]).css("backgroundColor") == ("rgb(143, 143, 143)"))) // every label which is not grey
    {
      if (types[i].innerText == "Shared Ride")
      {
        chosen_types.push("shared_ride");
      }
      else if (types[i].innerText == "Site Seeing") 
      {
        chosen_types.push("site_seeing");
      }
      else
      {
        chosen_types.push(types[i].innerText.toLowerCase());
      }
    }
  }
  // if no type has beean chosen we don't want to limit by type so we address this as all types were chosen.
  if (chosen_types.length == 0) 
  {
    for (i = 0; i < types.length - 1; i ++)
    {
     if (types[i].innerText == "Shared Ride")
      {
        chosen_types.push("shared_ride");
      }
      else if (types[i].innerText == "Site Seeing") 
      {
        chosen_types.push("site_seeing");
      }
      else
      {
        chosen_types.push(types[i].innerText.toLowerCase());
      }
    }
  }
return chosen_types;
}

/** hides the cards that were filtered out and writes the number of results after filter */
function hide_unwanted_cards(cards_to_hide, total_num)
{
  var k;
  //show number of results after filter
  var hide_num = cards_to_hide.length;
  if (total_num - hide_num  != 1)
  {
    utils.changeInnerText("resultsNum", total_num - hide_num + " results were found");
  }
  else
  {
    utils.changeInnerText("resultsNum", total_num - hide_num + " result was found");
  }
  //hide all cards that were filtered out
  for(k = 0; k < cards_to_hide.length; k ++) //hide all uncompatible cards
  {
    $(cards_to_hide[k]).hide();
  }
}


/** this function gets the filter values and choosed the compatible cards we need to present after the filter */
function getFilteredCards()
{
  var all_cards_details, scrollers, price, days, participants, types, chosen_types, all_cards, cards_to_hide, i, j, 
  final_results_num, total_num, num_res_arr, resnum, sel, strKm, km, dist, self_lat, self_loc, self_lon, loc_checkbox;
  var all_cards = document.getElementsByClassName("card");
  all_cards_details = getCardDetails(); //get all cards details
  //get results number info
  resnum = document.getElementById("resultsNum");
  num_res_arr = resnum.innerText.split(" ");
  total_num = parseInt(num_res_arr[0]);
  //get filter info
  scrollers = document.getElementsByClassName("bubble"); 
  price = parseInt(scrollers[0].innerText);
  days = parseInt(scrollers[1].innerText);
  participants = parseInt(scrollers[1].innerText);
  chosen_types = get_chosen_types();
  cards_to_hide = [];

  //get radius to filter location by
  loc_checkbox = document.getElementById("loc_checkbox");
  if (loc_checkbox.checked == true) //if checkbox is checked
  {
    sel = document.getElementById("radius_selector");
    strKm = sel.options[sel.selectedIndex].value;
    km = parseInt(strKm);
    //get self coordinates
    self_loc = document.getElementById("loc_holder");
    self_lat = parseFloat(self_loc.getAttribute("latitude"));
    self_lon = parseFloat(self_loc.getAttribute("longitude"));
    for (j = 0; j < all_cards_details.length; j ++)
    {
      dist = parseFloat(getDistanceFromLatLonInKm(self_lat,self_lon,all_cards_details[j]["latitude"],all_cards_details[j]["longitude"]));
      if(!(chosen_types.includes(all_cards_details[j]["type"])) || !(all_cards_details[j]["price"] <= price) || !(all_cards_details[j]["days"] <= days) || !(all_cards_details[j]["participants"] <= participants) || dist > km)
        {
          cards_to_hide.push(all_cards[j]);
        } 
    }
  }
  //else if the checkbox isn't checked 
  else
  {
    //filter by all other options and not location
    for (j = 0; j < all_cards_details.length; j ++)
    {
      if(!(chosen_types.includes(all_cards_details[j]["type"])) || !(all_cards_details[j]["price"] <= price) || !(all_cards_details[j]["days"] <= days) || !(all_cards_details[j]["participants"] <= participants))
      {
        cards_to_hide.push(all_cards[j]);
      }
    }
}
  hide_unwanted_cards(cards_to_hide, total_num);
  return cards_to_hide;
}

/**this function clears the filter */
function clearFilter(){
  var k, num_show, all_cards;
  all_cards = document.getElementsByClassName("card");
  for(k = 0; k < all_cards.length; k ++) 
  {
    $(all_cards[k]).show(); //unhide all uncompatible cards
  }
  num_show = all_cards.length;
  //show number of results after clear  
  if (num_show != 1)
  {
    utils.changeInnerText("resultsNum", num_show + " results were found");
  }
  else
  {
    utils.changeInnerText("resultsNum", num_show + " result was found");
  }
}

export{goToSearchResults, applyBasicSearch, update_search_headlines, map_doc_details,
       remove_unmatched_results, datestring_to_date, getFilteredCards, clearFilter};