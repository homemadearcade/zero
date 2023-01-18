import { v4 as uuidv4 } from 'uuid';

export const isLocalHost = () => {
  if(window.location.host.indexOf('localhost') !== -1) return true
}

export const checkIfTabAlreadyOpen = (callback) => {
  let otherPageOpen = false
  // Broadcast that you're opening a page.
  localStorage.openpages = Date.now();
  var onLocalStorageEvent = function(e){
    if(e.key === "openpages"){
        // Listen if anybody else is opening the same page!
      localStorage.webPage_available = Date.now();
    }
    if(e.key === "webPage_available"){
      otherPageOpen = true
    }
  };
  window.addEventListener('storage', onLocalStorageEvent, false);
  
  setTimeout(() => {
    if(otherPageOpen) {
      callback(true)
    } else {
      callback(false)
    }
  }, 100)
}

export const checkIfIncognito = (callback) => {
  var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
  if (!fs) {
    console.log("check failed?");
  } else {
    fs(window.TEMPORARY,
       100,
       () => {
        callback(false)
       },
       () => {
        callback(true)
      }
    )
  }
}

export const requestFullscreen = (element = document.body) => {
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) { // Native full screen.
    // may only be initiated by a user guesture
    requestMethod.call(element);
  }

}

export function stopPropagation(event) {
  event.stopPropagation()
}

export function preventDefault(event) {
  event.preventDefault()
}


export function throttleWheel(fn, wait) {
  var time = Date.now();

  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn(...arguments);
      time = Date.now();
    }
  }
}

export function setFontAwesomeCursor(unicode, color) {
  var canvas = document.createElement("canvas");
  canvas.width = 24;
  canvas.height = 24;
  //document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = color || '#000';
  ctx.font = "24px FontAwesome";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(unicode, 12, 12);
  var dataURL = canvas.toDataURL('image/png')
  document.body.style.cursor = 'url('+dataURL+'), auto';
}

export function generateUniqueId() {
  return uuidv4()
}

/**
 * @author alexwebgr < https://github.com/alexwebgr >
 * @desc the word 'Session' is used as a convention in order to avoid overriding
 * the Storage or localStorage objects since localStorage is persisted in the browser
 * even if the browser window closes or even the system restarts
 * the only way to delete localStorage is manually
 */

window.LocalStorageSession =
{
    //save an item to localStorage
    setItem : function (key, value)
    {
        return localStorage.setItem(key, JSON.stringify(value));
    },

    //retrieve an item from localStorage
    getItem : function (key)
    {
        if(localStorage.getItem(key) == undefined)
            return {};

        return JSON.parse(localStorage.getItem(key));
    },

    //remove one item from localStorage
    removeItem : function (key)
    {
        return window.LocalStorageSession.setItem(key, {});
    },

    //remove all items from localStorage
    clear : function()
    {
        localStorage.clear();
    }
};

/**
 * @usage use like an normal literal js object
 * when ready to save, it will get stringified and stored back in localStorage under the key name
 * that enables the storage of multiple keys that hold whole arrays and objects
 * not just strings or numbers
 */

/*
 var session = Session.getItem("session");
 session.key1 = "value1";
 session.key2 = "value2";
 
 session.key3 = {
    key1 : "value1"
 };
 
 session.key4 =
 [
     {
         key1 : "value1",
         key2 : "Value2"
     },
     {
         key1 : "value1",
         key2 : "Value2"
     }
 ]
 ;
 Session.setItem("session", session);
 */