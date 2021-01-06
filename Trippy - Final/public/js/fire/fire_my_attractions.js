// fiil the heart page with the matching cards based on the users past activity as recorded in the Firebase db

import * as utils from '../utils.js';
import { db, getCurrentUserId, isGuestUser, update_last_search} from './fire_basics.js';
import { map_doc_details} from './fire_search.js';
import {add_card_by_doc} from '../cards/attractions_cards.js';

const FEED_PARENT_SAVED_TID = "saved_feed";
const INSERT_BEFORE_SAVED_TID = "saved_end_feed";

const FEED_PARENT_UPCOMING_TID = "upcoming_feed";
const INSERT_BEFORE_UPCOMING_TID = "upcoming_end_feed";

const FEED_PARENT_PAST_TID = "past_feed";
const INSERT_BEFORE_PAST_TID = "past_end_feed";

const NO_RESULTS_CLASS = "noResults";

function get_loved_attractions(attractions_array, loved_ids)
{
  for(var i=attractions_array.length-1; i>=0; i--)
  {
    if(!loved_ids.includes(attractions_array[i]["id"]))
    {
      attractions_array.splice(i, 1);
    }
  }
  return attractions_array;  
}

function find_past_present_split_index(all_attractions)
{
  var today_start = new Date();
  today_start.setHours(0,0,0,0);
  
  for(var i=0; i< all_attractions.length; i++)
  {
    if (all_attractions[i]["data"]["start_date"].toDate() >= today_start)
    {
      return i;
    }
  }
  return all_attractions.length;
}

function keep_organizing_going_pending_only(attractions_array, user_id)
{
  var is_organizing, is_going, is_pending;
  for(var i=attractions_array.length-1; i>=0; i--)
  {
    is_organizing = (attractions_array[i]["data"].user_organizer == user_id);
    is_going = attractions_array[i]["data"].users_going.includes(user_id);
    is_pending = attractions_array[i]["data"].users_pending.includes(user_id)
    if((!is_organizing) && (!is_going) && (!is_pending))
    {
      attractions_array.splice(i, 1);
    }
  }
  return attractions_array;
}

function keep_organizing_going_only(attractions_array, user_id)
{
  var is_organizing, is_going;
  for(var i=attractions_array.length-1; i>=0; i--)
  {
    is_organizing = (attractions_array[i]["data"].user_organizer == user_id);
    is_going = attractions_array[i]["data"].users_going.includes(user_id);
    if((!is_organizing) && (!is_going))
    {
      attractions_array.splice(i, 1);
    }
  }
  return attractions_array;
}

function add_attractions_bulk(attractions_array, user_id, user_all_loved, feed_parent_tid, insert_before_tid)
{
  var is_att_loved;
  if (attractions_array.length == 0)
  {
    var no_results_elem = document.getElementById(feed_parent_tid).getElementsByClassName(NO_RESULTS_CLASS)[0];
    no_results_elem.setAttribute("style", "display: block");
  }

  else
  {
    for(var i=0; i<attractions_array.length; i++)
    {
      var att_doc_id = attractions_array[i]["id"];
      var att_data = attractions_array[i]["data"];
      if (user_all_loved.includes(att_doc_id))
      {
        is_att_loved = true;
      }
      else
      {
        is_att_loved = false;
      }

      add_card_by_doc(att_doc_id, att_data, user_id, is_att_loved,
                      feed_parent_tid, insert_before_tid);  
    }
  }
}

function initMyAttractions()
{
  var loved_attractions_ids;
  var cur_user = getCurrentUserId();
  db.collection("Users").doc(cur_user).get().then(function (doc)
  {
    loved_attractions_ids = doc.data().loved;
  
  })
  .then(function (t)
  {
    db.collection("Attractions").orderBy("start_date").get()
    .then(snapshot => snapshot.docs.map((doc) => map_doc_details(doc)))
    .then(function (all_attractions){
    {
      var present_attractions;
      var first_present_index = find_past_present_split_index(all_attractions);
      var past_attractions = all_attractions.slice(0, first_present_index);
      past_attractions = keep_organizing_going_only(past_attractions, cur_user);
      
      if (first_present_index == all_attractions.length)
      {
        present_attractions = [];
      }
      else
      {
        present_attractions = all_attractions.slice(first_present_index);
      }
      present_attractions = keep_organizing_going_pending_only(present_attractions, cur_user);

      var loved_attractions = get_loved_attractions(all_attractions, loved_attractions_ids);

      add_attractions_bulk(loved_attractions, cur_user, loved_attractions_ids,
                           FEED_PARENT_SAVED_TID, INSERT_BEFORE_SAVED_TID);
      
      add_attractions_bulk(past_attractions, cur_user, loved_attractions_ids,
                           FEED_PARENT_PAST_TID, INSERT_BEFORE_PAST_TID);
      
      add_attractions_bulk(present_attractions, cur_user, loved_attractions_ids,
                           FEED_PARENT_UPCOMING_TID, INSERT_BEFORE_UPCOMING_TID);
    }
    })
  })
}

export{initMyAttractions, find_past_present_split_index, keep_organizing_going_only};