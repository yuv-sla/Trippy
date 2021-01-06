// This File contains basic communications with the Firebase database (Mainly, but not just, init, users logins & logout)

const ENTRANCE_PAGE_PATH = "entrance_page.html";
const MAIN_PAGE_PATH = "main_search.html";
const PROFILE_PAGE_PATH = "profile_view.html";
const MY_EVENTS_PAGE_PATH = "my_events.html";
const INVALID_LOGIN_MSG_ID = "invlid_login_msg";

const OTHER_PICTURES_FOLDER = "Others";

let db, storage, provider;

function initFirebase() {
  // Your web app's Firebase configuration
  let firebaseConfig = {
    apiKey: "AIzaSyB8E4bgLXby0-n-lvuG33sjyRLTihIrBrs",
    authDomain: "trippy-2302a.firebaseapp.com",
    databaseURL: "https://trippy-2302a.firebaseio.com",
    projectId: "trippy-2302a",
    storageBucket: "trippy-2302a.appspot.com",
    messagingSenderId: "407408986746",
    appId: "1:407408986746:web:5bc3d01ea1f2c4483349c3",
    measurementId: "G-0FLSQXHYD3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();

  storage = firebase.storage();
  firebase.analytics();
  provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    localStorage.setItem("curUser",JSON.stringify(user));
  } else {
    // No user is signed in.
  }
});
};

function changeImgElemSrc(user_doc_id, picture_basename, img_elem) {
  var storageRef = storage.ref();
  var refAddress;
  if (["#p", "#1", "#2", "#3"].includes(picture_basename))
  {
    refAddress = "/" + OTHER_PICTURES_FOLDER + "/" + picture_basename + ".jpg";
  }
  else
  {
    refAddress = "/" + user_doc_id + "/" + picture_basename;
  }
  storageRef.child(refAddress).getDownloadURL().then(function (url) {
    img_elem.setAttribute("src", url);
  }).catch(function (error) {
    // Handle any errors
  });
}


function changeImgSrc(user_doc_id, picture_basename, tag_id) {
  var storageRef = storage.ref();
  var refAddress;
  if (["#p", "#1", "#2", "#3"].includes(picture_basename))
  {
    refAddress = "/" + OTHER_PICTURES_FOLDER + "/" + picture_basename + ".jpg";
  }
  else
  {
    refAddress = "/" + user_doc_id + "/" + picture_basename;
  }
  storageRef.child(refAddress).getDownloadURL().then(function (url) {
    document.getElementById(tag_id).setAttribute("src", url);
  }).catch(function (error) {
    console.log(error);
    // Handle any errors
  });
}

function getCurrentUser()
{
  return JSON.parse(localStorage.curUser);
}

function getCurrentUserId() // assuming user is logged in successfuly
{
  return getCurrentUser().uid;
}

function isGuestUser() // also called anonymous user
{
  return getCurrentUser().isAnonymous;
}

function connectGuestButtonsToPopup(buttons_ids)
{
  var curButton;
  if (localStorage.curUser && isGuestUser())
  {
    for (var i=0; i < buttons_ids.length; i++)
    {
      curButton = document.getElementById(buttons_ids[i]);
      curButton.setAttribute("data-toggle", "modal");
      curButton.setAttribute("data-target", "#myModalGuest");
      if ((curButton).hasAttribute("onclick"))
      {
        curButton.removeAttribute("onclick");
      }
    }
  }
}

function gotoCurUserProfile()
{
  window.location.href = PROFILE_PAGE_PATH + "?id=" + getCurrentUserId();
}

function personalizeSideBar(imgElemId, nameElemId)
{
  if(localStorage.curUser && !isGuestUser())
  {
    var curUserId = getCurrentUserId();
    var data;
    db.collection("Users").doc(curUserId).get().then(function(doc)
    {
      data = doc.data();
      document.getElementById(nameElemId).innerText = data.first_name + " " + data.last_name;
      changeImgSrc(curUserId, data.profile_image_name, imgElemId);
    })
  }
  else
  {
    document.getElementById("sidebar_myfriends").remove();
  }
}

function gotoCurUserMyEvents()
{
  window.location.href = MY_EVENTS_PAGE_PATH + "?id=" + getCurrentUserId();
}

function login_click() {
  const email = document.getElementById("UserName").value;
  const pass = document.getElementById("Password").value;
  try_login_email_pass(email, pass);
}

function guset_login()
{
  const promise = firebase.auth().signInAnonymously();
  promise.then(user => console.log(window.location.href=MAIN_PAGE_PATH))
  .catch(e => console.log(e.message)); // catch if login failed
  return false;
}


function google_login() // not utilized at the end
{
  firebase.auth().signInWithPopup(provider).then(function(user)
  {
    
    const user_ref = db.collection("Users").doc(getCurrentUserId());
    user_ref.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      usersRef.onSnapshot((doc) => {
        console.log(window.location.href=MAIN_PAGE_PATH);
      });
    } else {
      console.log("Google Account not registered to Trippy")
      // print that the user isn't registered to the app
    }
});

  })
  .catch(function(error) {
    console.log(error);
  });
}

function try_login_email_pass(email, pass, e) {
  const promise = firebase.auth().signInWithEmailAndPassword(email, pass);
  promise.then(user => console.log(window.location.href=MAIN_PAGE_PATH))
  .catch(function(e){
    console.log(e.message); // catch if login failed
    document.getElementById(INVALID_LOGIN_MSG_ID).setAttribute("style", "display: block");
  })
  return false;
}

function logout_user()
{
  firebase.auth().signOut().then(function()
  {
    localStorage.removeItem("curUser");
    window.location.href = ENTRANCE_PAGE_PATH;
  });
}

function update_last_search(search_arg, spots_arg, min_date_arg, max_date_arg)
{
  var cur_user_id = getCurrentUserId();
    db.collection("Users").doc(cur_user_id).update(
        {last_search: {"search": search_arg,
                       "spots": spots_arg,
                       "mindate_str": min_date_arg,
                       "maxdate_str": max_date_arg
                      }
        });
}

export{db, storage, initFirebase, changeImgSrc, getCurrentUserId, login_click,gotoCurUserProfile,
       gotoCurUserMyEvents, isGuestUser,update_last_search, changeImgElemSrc, guset_login,
       google_login, logout_user, connectGuestButtonsToPopup, personalizeSideBar};