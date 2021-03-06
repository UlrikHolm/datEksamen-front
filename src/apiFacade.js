import React, { useState, useEffect } from "react";
const URL = "https://drop.ulrik.me/datEksamen";
 
function handleHttpErrors(res) {
 if (!res.ok) {
   return Promise.reject({ status: res.status, fullError: res.json() })
 }
 return res.json();
}
 
function apiFacade() {
 /* Insert utility-methods from a latter step (d) here (REMEMBER to uncomment in the returned object when you do)*/
const setToken = (token) => {
  localStorage.setItem('jwtToken', token)
}
const getToken = () => {
return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
const loggedIn = getToken() != null;
return loggedIn;
}
const logout = () => {
localStorage.removeItem("jwtToken");
}

const getTokenVal = (props) => {
  const splitToken = getToken().split('.')[1]
  const decryptToken = atob(splitToken)
  const parsedToken = JSON.parse(decryptToken)
  const val = parsedToken[props]
  return(
  val)
}
 
const login = (user, password) => {
  const options = makeOptions("POST", true,{username: user, password: password });
  return fetch(URL + "/api/login", options)
    .then(handleHttpErrors)
    .then(res => {setToken(res.token) })
    .catch(err => {
      console.log(err);
      err.fullError.then(function(result) {
        alert(result.message);
      });
    })

}
const fetchData = () => {
  const options = makeOptions("GET",true); //True add's the token
  return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
}
const makeOptions= (method,addToken,body) =>{
   var opts = {
     method: method,
     headers: {
       "Content-type": "application/json",
       'Accept': 'application/json',
     }
   }
   if (addToken && loggedIn()) {
     opts.headers["x-access-token"] = getToken();
   }
   if (body) {
     opts.body = JSON.stringify(body);
   }
   return opts;
 }
 return {
     makeOptions,
     setToken,
     getToken,
     loggedIn,
     login,
     logout,
     fetchData,
     getTokenVal
 }
}
const facade = apiFacade();
export default facade;
