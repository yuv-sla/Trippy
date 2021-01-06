// invoke and initialize mangage tab if needed. If needs to invoke the tab create cards based on the data in the Firebase db

import {db, isGuestUser, getCurrentUserId} from "./fire_basics.js";
import {add_participant_card, add_join_req_card, add_organizer_card, PARTICIPANTS_PARENT_TID,
        JOIN_REQUESTS_PARENT_TID, NO_REQUESTS_P_TID, handle_requests_text, PARTICIPANTS_TITLE_TID, REQUESTS_TITLE_TID,
        syncronize_participants_title, syncronize_requests_layout} from "../cards/manage_cards.js";
import {map_doc_details} from "./fire_search.js";
import * as utils from '../utils.js';

function initManage()
{
  var users_details, cur_doc, temp_dict, cur_user_id, using_user_id, data, att_date, action_btn;
  var attraction_id = utils.getUrlQueryDict().get("id");
  using_user_id = getCurrentUserId();

  db.collection("Attractions").doc(attraction_id).get()
      .then(function(doc)
      {
        data = doc.data();
        
        
        if (data.user_organizer != using_user_id) // checks if the viewer isn't the organizer
        {
          if (data.users_pending.includes(using_user_id)) // for pending user
          {
            action_btn = document.getElementById("join_btn");
            action_btn.innerText = "Cancel My Request To Join";
            action_btn.setAttribute("onclick", "self_deny_pending('" + attraction_id + "', '" + using_user_id + "')"); // maybe change function later
            action_btn.setAttribute("data-target", "#myModal3");
          }

          else if (data.users_going.includes(using_user_id)) // for going user
          {
            action_btn = document.getElementById("join_btn");
            action_btn.innerText = "Cancel My Attendence";
            action_btn.setAttribute("onclick", "self_cancel_going('" + attraction_id + "', '" + using_user_id + "')"); // maybe change function later
            action_btn.setAttribute("data-target", "#myModal4");
          }
          document.getElementById("manage-tab-head").remove();
          document.getElementById("menu2").remove();

          att_date = data.start_date.toDate();
          if (att_date >= utils.get_current_date())
          {
            utils.unhide_tags(["buttons_footer"]);
          }
          return;
        }
        else
        {
          utils.unhide_tags(["manage-tab-head"]);
        }
      }
      )


    .then(function(t)
    {
        db.collection("Users").get().then(snapshot => snapshot.docs.map((doc) => map_doc_details(doc)))
    .then(function (all_docs)
    {
      if (document.getElementById("manage-tab-head")){
      users_details = {};
      for (var i=0; i< all_docs.length; i++)
      {
        temp_dict = {};
        temp_dict["full_name"] = all_docs[i]["data"].first_name + " " + all_docs[i]["data"].last_name;
        temp_dict["profile_basename"] = all_docs[i]["data"].profile_image_name;
        users_details[all_docs[i]["id"]] = temp_dict;
      }
      var pending_users = data.users_pending;
        var going_users = data.users_going;
        
        // move all those to a function which updates the Titles
        var spots_left = data.spots_left;
        var required_amount = data.required_amount;
        var total_going = data.going_amount;
        if (pending_users.length > 0)
        {
          for (var i=0; i < pending_users.length; i++)
          {
            cur_user_id = pending_users[i];
            add_join_req_card(cur_user_id, users_details[cur_user_id]["profile_basename"],
                              users_details[cur_user_id]["full_name"], attraction_id);
          }
          
          if (spots_left <= 0)
          {
            var approve_btns = document.getElementsByClassName("approve");
            for (var i=0; i< approve_btns.length; i++)
            {
              approve_btns[i].disabled = true;
            }
            // show the message that there arent spots available
          }
        }

        handle_requests_text();
        utils.unhide_tags([JOIN_REQUESTS_PARENT_TID]);
        
        if (going_users.length > 0)
        {
          for (var i=0; i < going_users.length; i++)
          {
            cur_user_id = going_users[i];
            add_participant_card(cur_user_id, users_details[cur_user_id]["profile_basename"],
                                 users_details[cur_user_id]["full_name"], attraction_id);
          }
        }

        // adding organizer
        cur_user_id = data.user_organizer;
        add_organizer_card(cur_user_id, users_details[cur_user_id]["profile_basename"],
                                 users_details[cur_user_id]["full_name"], attraction_id);

        var requests_title_elem = document.getElementById(REQUESTS_TITLE_TID);
        if (spots_left <= 0)
        {
          requests_title_elem.innerText = "Wait List: Attraction is Full";
        }
        else if (spots_left == 1)
        {
          requests_title_elem.innerText = "Join Requests: (1 Spot Left)";
        }
        else
        {
          requests_title_elem.innerText = "Join Requests: (" + spots_left + " Spots Left)";
        }
        
        requests_title_elem.setAttribute("spots_left", spots_left);
        syncronize_requests_layout();

        var participants_title_elem = document.getElementById(PARTICIPANTS_TITLE_TID);
        participants_title_elem.setAttribute("total_going", total_going);
        participants_title_elem.setAttribute("required_amount", required_amount);
        syncronize_participants_title();

        utils.unhide_tags([PARTICIPANTS_PARENT_TID]);

      }
      })
    }
    
    )
}

export {initManage};