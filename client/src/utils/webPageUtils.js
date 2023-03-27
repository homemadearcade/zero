import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'

import store from '../store';
import tinycolor from "tinycolor2";
import { getHexIntFromHexString } from './editorUtils';
import html2canvas from 'html2canvas'

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

export function getScreenshotOfElement(element, posX, posY, width, height, callback) {
    html2canvas(element, {
        onrendered: function (canvas) {
            var context = canvas.getContext('2d');
            var imageData = context.getImageData(posX, posY, width, height).data;
            var outputCanvas = document.createElement('canvas');
            var outputContext = outputCanvas.getContext('2d');
            outputCanvas.width = width;
            outputCanvas.height = height;

            var idata = outputContext.createImageData(width, height);
            idata.data.set(imageData);
            outputContext.putImageData(idata, 0, 0);
            callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
        },
        width: width,
        height: height,
        useCORS: true,
        taintTest: false,
        allowTaint: false
    });
}

export async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    // Clipboard API not available
    console.error('clipboard api not availble')
    return
  }
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy!', err)
  }}

export function getDeviceData() {
 var module = {
    options: [],
    header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
    dataos: [
        { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
        { name: 'Windows', value: 'Win', version: 'NT' },
        { name: 'iPhone', value: 'iPhone', version: 'OS' },
        { name: 'iPad', value: 'iPad', version: 'OS' },
        { name: 'Kindle', value: 'Silk', version: 'Silk' },
        { name: 'Android', value: 'Android', version: 'Android' },
        { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
        { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
        { name: 'Macintosh', value: 'Mac', version: 'OS X' },
        { name: 'Linux', value: 'Linux', version: 'rv' },
        { name: 'Palm', value: 'Palm', version: 'PalmOS' }
    ],
    databrowser: [
        { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
        { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
        { name: 'Safari', value: 'Safari', version: 'Version' },
        { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
        { name: 'Opera', value: 'Opera', version: 'Opera' },
        { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
        { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
    ],
    init: function () {
        var agent = this.header.join(' '),
            os = this.matchItem(agent, this.dataos),
            browser = this.matchItem(agent, this.databrowser);
        
        return { os: os, browser: browser };
    },
    matchItem: function (string, data) {
        var i = 0,
            j = 0,
            html = '',
            regex,
            regexv,
            match,
            matches,
            version;
        
        for (i = 0; i < data.length; i += 1) {
            regex = new RegExp(data[i].value, 'i');
            match = regex.test(string);
            if (match) {
                regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                matches = string.match(regexv);
                version = '';
                if (matches) { if (matches[1]) { matches = matches[1]; } }
                if (matches) {
                    matches = matches.split(/[._]+/);
                    for (j = 0; j < matches.length; j += 1) {
                        if (j === 0) {
                            version += matches[j] + '.';
                        } else {
                            version += matches[j];
                        }
                    }
                } else {
                    version = '0';
                }
                return {
                    name: data[i].name,
                    version: parseFloat(version)
                };
            }
        }
        return { name: 'unknown', version: 0 };
    }
  };

  const { os, browser } = module.init()

  return {
    osName: os.name, 
    osVersion: os.version,
    browserName: browser.name,
    browserVersion: browser.version,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor
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