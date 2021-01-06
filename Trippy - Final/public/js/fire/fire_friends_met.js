// generates friends met cards for a user based on the friends he met as recorded in the Firebase db

import { map_doc_details} from './fire_search.js';
import * as utils from '../utils.js';
import { db, getCurrentUserId} from './fire_basics.js';
import { find_past_present_split_index, keep_organizing_going_only} from './fire_my_attractions.js';
import { add_friend_card} from '../cards/friends_cards.js';


function get_people_met(past_attractions, cur_user, all_users_info)
{
  var people = [];
  var cur_organizer, cur_going;
  var people_data = [];
  var temp_dict = {};

  for(var i=0; i<past_attractions.length; i++)
  {
    var att_data = past_attractions[i]["data"];
    cur_organizer = att_data["user_organizer"];
    cur_going = att_data["users_going"]
    people.push(cur_organizer);
    people.push(...cur_going);
  }
  var uniq_people = [...new Set(people)];
  uniq_people.indexOf(cur_user) !== -1 && uniq_people.splice(uniq_people.indexOf(cur_user), 1);
  var full_name, profile_basename, uid;

  for (var i=0; i < all_users_info.length; i++)
  {
    if (uniq_people.includes(all_users_info[i]["id"]))
    {
      full_name = all_users_info[i]["data"].first_name + " " + all_users_info[i]["data"].last_name;
      profile_basename = all_users_info[i]["data"].profile_image_name;
      uid = all_users_info[i]["id"];
      people_data.push({"full_name": full_name, "profile_basename": profile_basename, "id": uid});
    }
  }
  
  return people_data;
}

function initMyFriends()
{
  var first_present_index, past_attractions, people_met, all_users;
  var cur_user = getCurrentUserId();
  db.collection("Users").get().then(snapshot => snapshot.docs.map((doc) => map_doc_details(doc)))
    .then(function (all_docs)
    {
      all_users = all_docs;
    })
    .then(function(){
      db.collection("Attractions").orderBy("start_date").get()
        .then(snapshot => snapshot.docs.map((doc) => map_doc_details(doc)))
        .then(function (all_attractions)
        {
          first_present_index = find_past_present_split_index(all_attractions);
          past_attractions = all_attractions.slice(0, first_present_index);
          past_attractions = keep_organizing_going_only(past_attractions, cur_user);
          people_met = get_people_met(past_attractions, cur_user, all_users);

          for (var i=0; i < people_met.length; i++)
          {
            add_friend_card(people_met[i]["id"], people_met[i]["profile_basename"], people_met[i]["full_name"]);
          }
      })
    })
}

export {initMyFriends};