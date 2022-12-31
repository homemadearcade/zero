import _ from "lodash";
import store from "../store";

export function centsToDollars(cents) {
  return (cents / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
}

export function getUrlParameter(name, url) {
  if (!url) url = global.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/*!
 * Find the differences between two objects and push to a new object
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 * @param  {Object} obj1 The original object
 * @param  {Object} obj2 The object to compare against it
 * @return {Object}      An object of differences between the two
 */
export function getDiff(obj1, obj2) {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
      return obj1;
  }

  //
  // Variables
  //

  var diffs = {};
  var key;


  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  var arraysMatch = function (arr1, arr2) {

      // Check if the arrays are the same length
      if (arr1.length !== arr2.length) return false;

      // Check if all items exist and are in the same order
      for (var i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) return false;
      }

      // Otherwise, return true
      return true;

  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  var compare = function (item1, item2, key) {

      // Get the object type
      var type1 = Object.prototype.toString.call(item1);
      var type2 = Object.prototype.toString.call(item2);

      // If type2 is undefined it has been removed
      if (type2 === '[object Undefined]') {
          diffs[key] = null;
          return;
      }

      // If items are different types
      if (type1 !== type2) {
          diffs[key] = item2;
          return;
      }

      // If an object, compare recursively
      if (type1 === '[object Object]') {
          var objDiff = getDiff(item1, item2);
          if (Object.keys(objDiff).length > 0) {
              diffs[key] = objDiff;
          }
          return;
      }

      // If an array, compare
      if (type1 === '[object Array]') {
          if (!arraysMatch(item1, item2)) {
              diffs[key] = item2;
          }
          return;
      }

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (type1 === '[object Function]') {
          if (item1.toString() !== item2.toString()) {
              diffs[key] = item2;
          }
      } else {
          if (item1 !== item2 ) {
              diffs[key] = item2;
          }
      }

  };


  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
      if (obj1.hasOwnProperty(key)) {
          compare(obj1[key], obj2[key], key);
      }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
      if (obj2.hasOwnProperty(key)) {
          if (!obj1[key] && obj1[key] !== obj2[key] ) {
              diffs[key] = obj2[key];
          }
      }
  }

  // Return the object of differences
  return diffs;

};



/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function urlToFile(url, filename, mimeType){
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename,{type:mimeType});})
  );
}

export function getTextureMetadata(textureId) {
  const spriteIndexIdentifier = '-sprite'
  const endOfSpritesheetNameIndex = textureId.indexOf(spriteIndexIdentifier);

  if(endOfSpritesheetNameIndex === -1) {
    const awsImages = store.getState().gameModel.gameModel.awsImages
    if(awsImages[textureId]) {
      return {
        isAwsImage: true
      }
    } else {
      return {}
    }
  }

  return {
    spriteSheetName: textureId.slice(0, endOfSpritesheetNameIndex),
    spriteIndex: textureId.slice(endOfSpritesheetNameIndex + spriteIndexIdentifier.length)
  }
}

export function getSpriteData(textureId) {
  const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
  return window.spriteSheets[spriteSheetName].sprites[spriteIndex]
}


export function closestToZero(numbers)
{
    if (numbers.length === 0) return 0;
    
    let closest = numbers[0];

    for(let i = 0; i < numbers.length;i++){
        let number = numbers[i];
        let absNumber =  Math.abs(number);
        let absClosest = Math.abs(closest);

        if (absNumber < absClosest) 
        {
            closest = number;
        } 
        else if (absNumber === absClosest && closest < 0) 
        {
            closest = number;
        }
    }

    return closest;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
