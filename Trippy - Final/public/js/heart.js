// handles addition/removal of attractions to/from loved

import {db, isGuestUser, getCurrentUserId} from "./fire/fire_basics.js";

$(".star.glyphicon").click(function() {
  $(this).toggleClass("glyphicon-star glyphicon-star-empty");
});

function getHeartsAttId(heartElement)
{
  var card_container = heartElement.parentNode.parentNode.getElementsByClassName("card-container")[0];
  var att_id = card_container.onclick.toString().split("id=")[1];
  att_id = att_id.substring(0, att_id.length - 3);
  return att_id;
}

function addLovedAttraction(att_doc_id)
{
  var cur_user_id = getCurrentUserId();
  db.collection("Users").doc(cur_user_id).update(
    {
      loved: firebase.firestore.FieldValue.arrayUnion(att_doc_id)
    }
  );
}

function removeLovedAttraction(att_doc_id)
{
  var cur_user_id = getCurrentUserId();
  db.collection("Users").doc(cur_user_id).update(
    {
      loved: firebase.firestore.FieldValue.arrayRemove(att_doc_id)
    }
  );
}


function changeOfHeart(x) {
    if ( x.classList.contains( "fa-heart") ) { // loved before the click need to remove because of it
        x.classList.remove( "fa-heart" );
        x.classList.add( "fa-heart-o" );
        if (!isGuestUser())
        {
          var att_id = getHeartsAttId(x);
          removeLovedAttraction(att_id);
        }
    }
    else { // not loved before the click. need to add to loved because of the click
        x.classList.remove( "fa-heart-o" );
        x.classList.add( "fa-heart" );
        if (!isGuestUser())
        {
          var att_id = getHeartsAttId(x);
          addLovedAttraction(att_id);
        }
    }
}

export{changeOfHeart};
