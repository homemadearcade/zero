import { v4 as uuidv4 } from 'uuid';
import store from '../store';
import tinycolor from "tinycolor2";
import { getHexIntFromHexString } from './editorUtils';
import { nanoid } from 'nanoid'

export function getThemePrimaryColor() {
  const color = store.getState().theme.primaryColor
  return {
    hexString: color,
    hexCode: getHexIntFromHexString(color),
    rgba: function(alpha) {
      const tcolor = tinycolor(color)
      const { r, g, b } = tcolor.toRgb()
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  }
}

export const isLocalHost = () => {
  if(window.location.host.indexOf('localhost') !== -1) return true
}

export function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
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
    callback(true)
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

export const closeFullscreen = () => {
  document.exitFullscreen()
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
  return nanoid(10) + "_1"
}

export function generateSecureUniqueId() {
  return uuidv4()
}