import nearestColor from 'nearest-color';
import colorNameList from 'color-name-list';
import colorNames from './colorNames.json'
import { splitIntoSubarrays } from './arrayUtils';
import { getHexIntFromHexString } from './editorUtils';
import tinycolor from 'tinycolor2';

export function enrichHexStringColor(color) {
  return {hexString: color,
    hexCode: getHexIntFromHexString(color),
    rgba: function(alpha) {
      const tcolor = tinycolor(color)
      const { r, g, b } = tcolor.toRgb()
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  }
}

// nearestColor need objects {name => hex} as input
function swapKeysAndValues(obj) {
  // 👇️ [['color', 'blue'], ['fruit', 'apple']]
  const swapped = Object.entries(obj).map(
    ([key, value]) => [value, key]
  );

  return Object.fromEntries(swapped);
}

const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
const nearest = nearestColor.from({...colors, ...swapKeysAndValues(colorNames)});

var Color = function Color(hexVal) { //define a Color class for the color objects
  this.hex = hexVal;
};

const constructColor = function(colorObj){
  var hex = colorObj.hex.substring(1);
  /* Get the RGB values to calculate the Hue. */
  var r = parseInt(hex.substring(0, 2), 16) / 255;
  var g = parseInt(hex.substring(2, 4), 16) / 255;
  var b = parseInt(hex.substring(4, 6), 16) / 255;
  
  /* Getting the Max and Min values for Chroma. */
  var max = Math.max.apply(Math, [r, g, b]);
  var min = Math.min.apply(Math, [r, g, b]);
  
  /* Variables for HSV value of hex color. */
  var chr = max - min;
  var hue = 0;
  var val = max;
  var sat = 0;
  
  if (val > 0) {
      /* Calculate Saturation only if Value isn't 0. */
      sat = chr / val;
      if (sat > 0) {
          if (r === max) {
              hue = 60 * (((g - min) - (b - min)) / chr);
              if (hue < 0) {
                  hue += 360;
              }
          } else if (g === max) {
              hue = 120 + 60 * (((b - min) - (r - min)) / chr);
          } else if (b === max) {
              hue = 240 + 60 * (((r - min) - (g - min)) / chr);
          }
      }
  }
  colorObj.chroma = chr;
  colorObj.hue = hue;
  colorObj.sat = sat;
  colorObj.val = val;
  colorObj.luma = 0.3 * r + 0.59 * g + 0.11 * b;
  colorObj.red = parseInt(hex.substring(0, 2), 16);
  colorObj.green = parseInt(hex.substring(2, 4), 16);
  colorObj.blue = parseInt(hex.substring(4, 6), 16);
  return colorObj;
};

const sortColorsByHue = function (colors) {
  return colors.sort(function (a, b) {
    return a.hue - b.hue;
  });
};
const sortColorsByLum = function (colors) {
  return colors.sort(function (a, b) {
    return a.luma - b.luma;
  });
};
const sortColorsBySaturation = function (colors) {
  return colors.sort(function (a, b) {
    // console.log((a.sat * 10) - (b.sat * 10))
    return (a.sat * 10) - (b.sat * 10);
  });
};

const sortColorsByChroma = function (colors) {
  return colors.sort(function (a, b) {
    // console.log((a.chroma) - (b.chroma))
    return a.chroma - b.chroma;
  });
};

export const sortColors = function(sortBy, hexArray) { 
  var colors = [];
  hexArray.forEach(function (v) {
    var color = new Color(v);
    constructColor(color);
    colors.push(color);
  });
  
  if(sortBy === 'luma') {
    sortColorsByLum(colors);
  } else if(sortBy === 'hue') {
    sortColorsByHue(colors);
  } else if(sortBy === 'saturation') {
    sortColorsBySaturation(colors);
  } else if(sortBy === 'chroma') {
    sortColorsByChroma(colors);
  }  
  

  return colors.filter(({sat, red, green, blue}) => {
    if(sat < 0.3) return false 
    if(sat > 0.85) return false 

    const diff1 = Math.abs(red - green )
    const diff2 = Math.abs(red - blue) 
    if(diff1 < 40 && diff2 < 40) return false 

    return true
  }).map(({hex}) => hex)
};



// get closest named color
export const findColorNameByHex = function(hex) {
  return nearest(hex).name;
}

export function createColors() {


  const colorsSortedLayer1 = sortColors('hue', Object.keys(colorNames))

  const colorsSortedLayer3 = splitIntoSubarrays(
    colorsSortedLayer1, 
    Math.floor(colorsSortedLayer1.length/8)
  ).map((colors) => {
    const colorsSortedLayer2 = sortColors('luma', colors)
    return splitIntoSubarrays(
      colorsSortedLayer2, 
      Math.floor(colorsSortedLayer2.length/19)
    ).reduce((prev, newColors) => {
      prev.push(...sortColors('luma', newColors))
      return prev
    }, [])
  })

  return colorsSortedLayer3
}
