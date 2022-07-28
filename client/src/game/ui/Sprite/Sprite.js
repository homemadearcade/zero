import React, { useRef, useEffect } from 'react'
import tinycolor from 'tinycolor2'
import { getTextureMetadata, getSpriteData } from '../../../utils/utils'
import './Sprite.scss'

export default function Sprite(props) {
  const canvasRef = useRef(null)

  function drawImageWithTint(drawingContext, image, tint, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
    // create offscreen buffer, 
    const buffer = document.createElement('canvas');
    buffer.width = drawingContext.canvas.width;
    buffer.height = drawingContext.canvas.height;
    const bx = buffer.getContext('2d');

    // fill offscreen buffer with the tint color
    bx.fillStyle = tint
    bx.fillRect(0,0,buffer.width,buffer.height);

    // destination atop makes a result with an alpha channel identical to image, but with all pixels retaining their original color *as far as I can tell*
    bx.globalCompositeOperation = "destination-atop";
    bx.drawImage(image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);

    // to tint the image, draw it first
    drawingContext.drawImage(image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);

    //then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
    drawingContext.globalAlpha = 0.5;
    drawingContext.drawImage(buffer, dx, dy);
    drawingContext.globalAlpha = 1
  }

  useEffect(() => {
    if(!props.textureId) return
    const { spriteSheetName } = getTextureMetadata(props.textureId)
    if(!spriteSheetName) return
    const texture = getSpriteData(props.textureId)  
    if(!texture) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.webkitImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    const x = texture.x
    const y = texture.y
    const width = texture.width
    const height = texture.height

    const image = new Image();
    image.src = '/'+window.spriteSheets[spriteSheetName].serverImageUrl;

    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      if(props.tint) {
        drawImageWithTint(context, image, props.tint, x, y, width, height, 0, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
      }

    };
  }, [props.textureId, props.tint])

  let tintStyle = {}
  if(props.tint) {
    // const hue = Math.floor(tinycolor(props.tint).setAlpha(0.5).toHsl().h)
    // // console.log(hue)
    // tintStyle = {
    // }
    tintStyle = {
      // backgroundColor: tinycolor(this.props.tint).toRgbString(),
      // backgroundBlendMode: 'multiply',
      filter: `saturate(200%) brightness(0.7) contrast(150%)`
    }
  }

  if(!props.textureId) {
    return <div className="Sprite" style={{backgroundColor: props.tint, backgroundSize: 'cover'}}/>
  }

  return <canvas onClick={() => {
    if(props.onClick) props.onClick(props.textureId)
  }} className="Sprite" style={tintStyle} ref={canvasRef}/>
}