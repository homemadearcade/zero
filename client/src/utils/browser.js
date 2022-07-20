export const checkIfTabAlreadyOpen = (callback) => {
  let otherPageOpen = false
  // Broadcast that you're opening a page.
  localStorage.openpages = Date.now();
  var onLocalStorageEvent = function(e){
    if(e.key === "openpages"){
        // Listen if anybody else is opening the same page!
      localStorage.page_available = Date.now();
    }
    if(e.key === "page_available"){
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

export const requestFullscreen = (element = document.body) => (dispatch, getState) => {
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) { // Native full screen.
      requestMethod.call(element);
  }
}

export function stopPropagation(event) {
  event.stopPropagation()
}

export function preventDefault(event) {
  event.preventDefault()
}

