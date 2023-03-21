import React, { useRef, useEffect } from 'react'
import { getTextureMetadata, getSpriteSheetData, getImageUrlFromTextureId } from '../../../utils/utils'
import './Texture.scss'

export default function Texture(props) {
  const canvasRef = useRef(null)

  function drawImageWithTint(drawingContext, texture, textureTint,  dx, dy, dwidth, dheight) {
    // create offscreen buffer, 
    const buffer = document.createElement('canvas');
    buffer.width = drawingContext.canvas.width;
    buffer.height = drawingContext.canvas.height;
    const bx = buffer.getContext('2d');

    // fill offscreen buffer with the textureTint color
    bx.fillStyle = textureTint
    bx.fillRect(0,0,buffer.width,buffer.height);

    // destination atop makes a result with an alpha channel identical to texture, but with all pixels retaining their original color *as far as I can tell*
    bx.globalCompositeOperation = "destination-atop";

    bx.drawImage(texture, dx, dy, dwidth, dheight);

    // to textureTint the texture, draw it first
    drawingContext.drawImage(texture, dx, dy, dwidth, dheight);

    //then set the global alpha to the amound that you want to textureTint it, and draw the buffer directly on top of it.
    drawingContext.globalAlpha = 0.5;
    drawingContext.drawImage(buffer, dx, dy);
    drawingContext.globalAlpha = 1
  }

  function drawTextureWithTint(drawingContext, texture, textureTint, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
    // create offscreen buffer, 
    const buffer = document.createElement('canvas');
    buffer.width = drawingContext.canvas.width;
    buffer.height = drawingContext.canvas.height;
    const bx = buffer.getContext('2d');

    // fill offscreen buffer with the textureTint color
    bx.fillStyle = textureTint
    bx.fillRect(0,0,buffer.width,buffer.height);

    // destination atop makes a result with an alpha channel identical to texture, but with all pixels retaining their original color *as far as I can tell*
    bx.globalCompositeOperation = "destination-atop";

    bx.drawImage(texture, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);

    // to textureTint the texture, draw it first
    drawingContext.drawImage(texture, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);

    //then set the global alpha to the amound that you want to textureTint it, and draw the buffer directly on top of it.
    drawingContext.globalAlpha = 0.5;
    drawingContext.drawImage(buffer, dx, dy);
    drawingContext.globalAlpha = 1
  }

  useEffect(() => {
    if(!props.textureId) return
    
    let x, y, width, height;

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.webkitImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    const { spriteSheetName } = getTextureMetadata(props.textureId)
    if(spriteSheetName) {
      const texture = getSpriteSheetData
(props.textureId) 
      if(!texture) return console.log('something messed up in Texture')
      x = texture.x
      y = texture.y
      width = texture.width
      height = texture.height

      const loadingImage = new Image();
      loadingImage.src = '/'+window.spriteSheets[spriteSheetName].serverImageUrl;
  
      loadingImage.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        if(props.textureTint) {
          drawTextureWithTint(context, loadingImage, props.textureTint, x, y, width, height, 0, 0, canvas.width, canvas.height);
        } else {
          context.drawImage(loadingImage, x, y, width, height, 0, 0, canvas.width, canvas.height);
        }
  
      };
    } else {
      const loadingImage = new Image();
      loadingImage.src = getImageUrlFromTextureId(props.textureId);
  
      loadingImage.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        if(props.textureTint) {
          drawImageWithTint(context, loadingImage, props.textureTint, 0, 0, canvas.width, canvas.height);
        } else {
          context.drawImage(loadingImage, 0, 0, canvas.width, canvas.height);
        }
  
      };
    }

  }, [props.textureId, props.textureTint])

  let textureTintStyle = {}
  if(props.textureTint) {
    // const hue = Math.floor(tinycolor(props.textureTint).setAlpha(0.5).toHsl().h)
    // // console.log(hue)
    // textureTintStyle = {
    // }
    textureTintStyle = {
      // backgroundColor: tinycolor(this.props.textureTint).toRgbString(),
      // backgroundBlendMode: 'multiply',
      filter: `saturate(200%) brightness(0.7) contrast(150%)`
    }
  }

  if(!props.textureId) {
    return <div className="Texture" style={{backgroundColor: props.textureTint, backgroundSize: 'cover'}}/>
  }

  return <canvas onClick={() => {
    if(props.onClick) props.onClick(props.textureId)
  }} className="Texture" style={textureTintStyle} ref={canvasRef}/>
}