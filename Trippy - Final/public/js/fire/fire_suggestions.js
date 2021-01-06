// invokes suggestions to the user based on his last search as written in the Firebase db

import * as utils from '../utils.js';
import { db, getCurrentUserId, isGuestUser} from './fire_basics.js'
import {add_suggestion_by_doc} from '../cards/suggestions_cards.js';
import {map_doc_details, remove_unmatched_results, datestring_to_date} from './fire_search.js';

const LIMIT_FACTOR = 5;
const RESULTS_FEED_PAGE_PATH = "search_results.html";

const UPCOMING_PARENT_TID = "upcoming_feed";
const UPCOMING_INSERT_BEFORE_TID = "upcoming_insert_before";
const UPCOMING_SEE_MORE_TID = "upcoming_more";
const UPCOMING_CONTAINER_TID = "upcoming_attractions";

const LAST_SEARCH_PARENT_TID = "last_search_feed";
const LAST_SEARCH_INSERT_BEFORE_TID = "last_search_insert_before";
const LAST_SEARCH_SEE_MORE_TID = "last_search_more";
const LAST_SEARCH_TITLE_TID = "last_search_title";
const LAST_SEARCH_CONTAINER_TID = "last_search_attractions";

function add_upcoming_suggestions(upcoming_docs)
{
  var cur_doc;
  if (upcoming_docs.length > 0)
      {
        for (var i=0; i<upcoming_docs.length; i++)
        {
          cur_doc = upcoming_docs[i];
          if(parseInt(cur_doc["data"].spots_left) >= 1)
          {
            add_suggestion_by_doc(cur_doc["id"], cur_doc["data"], UPCOMING_PARENT_TID,
                                  UPCOMING_INSERT_BEFORE_TID);
          }
        }
        var see_more_href = RESULTS_FEED_PAGE_PATH + "?search=&spots=1&mindate=" +
                            moment().format("DD/MM/YYYY") + '&maxdate=';
        var href_command = "window.location.href =' " + see_more_href + "';";
        document.getElementById(UPCOMING_SEE_MORE_TID).setAttribute("onclick",href_command);
        utils.unhide_tags([UPCOMING_CONTAINER_TID]);
      }
}

function get_last_search_title(last_search)
{
  var title = "Last Search: " + last_search["search"] + " (" + last_search["spots"] + " ";
  if (parseInt(last_search["spots"]) == 1)
  {
    title += "person)"
  }
  else
  {
    title += "presons)";
  }
  return title;
}

function add_last_search_suggestions(last_search_docs, last_search)
{
  var cur_doc;
  last_search_docs = last_search_docs.slice(0, LIMIT_FACTOR);
  if (last_search_docs.length > 0)
  {
    for (var i=0; i<last_search_docs.length; i++)
    {
      cur_doc = last_search_docs[i];
      add_suggestion_by_doc(cur_doc["id"], cur_doc["data"], LAST_SEARCH_PARENT_TID,
                            LAST_SEARCH_INSERT_BEFORE_TID);
    }
    var today_date = moment().format("DD/MM/YYYY");
    var see_more_href = RESULTS_FEED_PAGE_PATH + "?search=" + last_search["search"] + "&spots=" +
                        last_search["sptos"] + "&mindate=" + today_date + '&maxdate=';
    
    var href_command = "window.location.href = '" + see_more_href + "';";
    
    document.getElementById(LAST_SEARCH_SEE_MORE_TID).setAttribute("onclick",href_command);  
    utils.changeInnerText(LAST_SEARCH_TITLE_TID, get_last_search_title(last_search));
  
    utils.unhide_tags([LAST_SEARCH_CONTAINER_TID]);
  }

}

function initSuggestions()
{
  var today_date = datestring_to_date(moment().format("DD/MM/YYYY"));
  var future_attractions_qref = db.collection("Attractions").where("start_date", ">=", today_date)
  .orderBy("start_date");
  future_attractions_qref.limit(LIMIT_FACTOR).get().then(snapshot => snapshot.docs.map((doc) => map_doc_details(doc)))
    .then(function (all_docs)
    {
      add_upcoming_suggestions(all_docs);
    })
    .then(function(t)
    {
      if (!isGuestUser())
      {
        var last_search;
        var cur_user = getCurrentUserId();
        db.collection("Users").doc(cur_user).get().then(function(doc)
        {
          last_search = doc.data().last_search;
          if (last_search["search"] != "")
          {
            future_attractions_qref.get().then(snapshot => snapshot.docs.map((doc) => map_doc_details(doc)))
            .then(function (all_docs)
            {
              all_docs = remove_unmatched_results(all_docs, last_search["search"],
                                                  parseInt(last_search["spots"]));
              
              add_last_search_suggestions(all_docs, last_search);
            })
          }
        })
      }
    })
}

export {initSuggestions};