// handles signing up a new user to the Firebase db

import * as utils from '../utils.js'
import {db, changeImgElemSrc, getCurrentUserId} from "./fire_basics.js"

const LAST_SEARCH_DEFAULT = {"maxdate_str": '',
                             "mindate_str": '',
                             "search": '',
                             "spots": ''}
const DEFAULT_PROFILE_BASENAME = "#p";
const DEFAULT_ATMOSPHERE_IMAGES_NAMES = ["#1", "#2", "#3"];


function signUpUserToDB(userDetails)
{
  const [firstName, lastName, userAge, userCity, userCountry, userLanguages, userGender, userAbout, email, password] = userDetails;
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function() 
  {
    db.collection("Users").doc(firebase.auth().currentUser.uid)
    .set({
      first_name: firstName,
      last_name: lastName,
      age: userAge,
      city: userCity,
      country: userCountry,
      languages: userLanguages,
      gender: userGender,
      about: userAbout,
      atmosphere_images_names: DEFAULT_ATMOSPHERE_IMAGES_NAMES,
      loved: [],
      notifications: [],
      notifications_saw: 0,
      last_search: LAST_SEARCH_DEFAULT,
      profile_image_name: DEFAULT_PROFILE_BASENAME 
    })
    .then(function(){
      window.location.href= "main_search.html";
      })
    .catch(error => {
        console.log('Something went wrong with added user to firestore: ', error);
    })
  })
  
  .catch(function(error)
  {
    console.log('Something went wrong with sign up: ', error);
  }      
  )
}

function extractUserInfo()
{
  var userDetails = [];
  var first_name = document.getElementById("firstNameInput").value;
  var last_name = document.getElementById("lastNameInput").value;
  var email = document.getElementById("emailInput").value;
  var phone = document.getElementById("phoneInput").value;
  var city = document.getElementById("cityInput").value;
  var country = document.getElementById("countryInput").value;
  var password = document.getElementById("passwordInput").value;
  var gender = document.getElementById("genderDropdown").value;
  var about = document.getElementById("aboutInput").value;
  var languages = document.getElementById("myTags").value.split(",");
  var age = utils.getAge(utils.extract_date_from_tag("datepicker"));
  
  userDetails.push(first_name);
  userDetails.push(last_name);
  userDetails.push(age);
  userDetails.push(city);
  userDetails.push(country);
  userDetails.push(languages);
  userDetails.push(gender);
  userDetails.push(about);
  userDetails.push(email);
  userDetails.push(password);
  return userDetails;
}

function signUpUser()
{
  signUpUserToDB(extractUserInfo());
}

function checkSign(event)
{
  event.preventDefault();
  var form = document.getElementById("form1");
  if (form.reportValidity() === false)
      {
        console.log("not valid");
      }
      else
      {
        console.log("is valid");
        signUpUserToDB(extractUserInfo());
      }
}

export {checkSign, extractUserInfo};
