// This file handles the creation of new attraction in the Firebase database (from the attraction creation process)

import { db, initFirebase, getCurrentUserId } from './fire_basics.js'
import * as utils from '../utils.js'

function createNewAtt(docRef)
{
  let full_duration;
  var org_id = getCurrentUserId();
  var name = document.getElementById("AttractionName").value;
  var attraction_type = document.getElementById("sel2").value;
  var start_d = document.getElementById("frmSaveOffice_startdt").value;
  var dur_num = document.getElementById("dur_num").value;
  var dur_frame = document.getElementById("sel1").value;
  var leaving_f = document.getElementById("Leaving_from").value;
  var cost = parseInt(document.getElementById("priceNumber").value);
  if (isNaN(cost))
  {
    cost = "";
  }
  var participants_num = parseInt(document.getElementById("part_num").value);
  var descript = document.getElementById("exampleFormControlTextarea3").value;
  var tags = document.getElementById("myTags").value;
  var equip = document.getElementById("ti").value;
  var long = document.getElementById("longitude").innerText;
  var lat = document.getElementById("latitude").innerText;
  
  if (checkDuration(dur_frame))
  {
    full_duration = dur_num + " " + dur_frame;
  }
  else
  {
    full_duration = dur_frame;
  }
  
  var start_date_ob = utils.extract_date_from_tag("frmSaveOffice_startdt");
  start_date_ob = firebase.firestore.Timestamp.fromDate(start_date_ob);
    
  docRef.add({'name': name, 'start_date': start_date_ob, 'duration': full_duration,
                'leaving_from': leaving_f, 'coordinats': new firebase.firestore.GeoPoint(parseFloat(lat), parseFloat(long)),
                'cost': cost, 'currency': " $", 'description':descript, 'tags': tags.split(','), 
                'equipment': equip.split(','), 'required_amount': participants_num, 'going_amount': 1,
                'spots_left': participants_num - 1, 'user_organizer':org_id, 'users_going':[], 
                'users_pending': [], 'type': attraction_type, 
                'age_restriction':{'is_active':false, 'max_age':"",'min_age':""},
                'gender_restrictions':{'is_active':false, 'gender':""},
                'language_restrictions':{'is_active':false, 'languages':""}})
}

function update_review_section()
{
  var name = document.getElementById("AttractionName").value;
  var attraction_type = document.getElementById("sel2").value;
  var start_d = document.getElementById("frmSaveOffice_startdt").value;
  var dur_num = document.getElementById("dur_num").value;
  var dur_frame = document.getElementById("sel1").value;
  var leaving_f = document.getElementById("Leaving_from").value;
  var cost = parseInt(document.getElementById("priceNumber").value);
  if (isNaN(cost))
  {
    cost = "";
  }
  var participants_num = parseInt(document.getElementById("part_num").value);
  var descript = document.getElementById("exampleFormControlTextarea3").value;
  var tags = document.getElementById("myTags").value;
  var equip = document.getElementById("ti").value;
  
  utils.changeInnerText("att_name", name);
  utils.changeInnerText("start_date", start_d);
  if (checkDuration(dur_frame))
  {
    utils.changeInnerText("duration", dur_num + " " + dur_frame);
  }
  else
  {
    utils.changeInnerText("duration", dur_frame);
  }
  utils.changeInnerText("participants", participants_num);
  utils.changeInnerText("att_type", attraction_type);
  utils.changeInnerText("leaving_from", leaving_f);
  utils.changeInnerText("cost", "$"+cost);
  utils.changeInnerText("description", descript)
  utils.changeInnerText("tags", tags);
  utils.changeInnerText("equipment", equip);
}

function checkDuration(dur_frame)
{
  if (dur_frame == "Day/s")
  {
    return 1;
  }
  return 0;
}

function initCreateAttPage(){
  let name, start_d, attraction_type, dur_num, dur_frame, leaving_f, cost, currency, participants_num, descript, tags, equip, long, lat;
  var docRef = db.collection("Attractions");
  createNewAtt(docRef);
}

export {initFirebase, initCreateAttPage, update_review_section};