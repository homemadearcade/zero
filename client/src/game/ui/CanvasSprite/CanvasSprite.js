import React, { useRef, useEffect } from 'react'
import tinycolor from 'tinycolor2'
import { getTextureMetadata, getSpriteData } from '../../../utils/utils'
import './CanvasSprite.scss'

export default function CanvasSprite(props) {
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
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.webkitImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    const { spriteSheetName } = getTextureMetadata(props.textureId)
    if(!spriteSheetName) return
    const texture = getSpriteData(props.textureId)  
    if(!texture) return

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
    const hue = Math.floor(tinycolor(props.tint).setAlpha(0.5).toHsl().h)
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
    return <div className="CanvasSprite" style={{backgroundColor: props.ting, backgroundSize: 'cover'}}/>
  }

  return <canvas className="CanvasSprite" style={tintStyle} ref={canvasRef}/>
}

/*
    let desiredWidth = this.props.width
    let desiredHeight = this.props.height

    const emptySprite = <div style={{width: desiredWidth, height: desiredHeight}}></div>

    const { spriteSheetName } = getTextureMetadata(this.props.textureId)
    if(!spriteSheetName) return emptySprite
    const texture = getSpriteData(this.props.textureId)
    if(!texture)  return emptySprite


    const backgroundImage = "url('/"+window.spriteSheets[spriteSheetName].serverImageUrl+"')"

    let tintStyle = {}
    if(this.props.tint && this.props.tint !== '#FFFFFF') {
      const hue = Math.floor(tinycolor(this.props.tint).setAlpha(0.5).toHsl().h)
      // // console.log(hue)
      // tintStyle = {
      // }
      tintStyle = {
        backgroundColor: tinycolor(this.props.tint).toRgbString(),
        backgroundBlendMode: 'multiply',
        filter: `saturate(200%) hue-rotate(${hue}deg)`
      }
    }

    const backgroundPositionX = -texture.x
    const backgroundPositionY = -texture.y
    const width = texture.width
    const height = texture.height

    const scaleX  = desiredWidth/width
    const scaleY = desiredHeight/height
    const translate = (desiredWidth - width)/2 + 'px'
    const translateY = (desiredHeight - height)/2 + 'px'

    const transform = `scaleX(${scaleX}) scaleY(${scaleY})`;

    const transformContainer = `translateX(${translate}) translateY(${translateY})`
    return <div 
      className={'SpriteContainer ' + this.props.className} 
      onClick={() => {
        if(this.props.onClick) this.props.onClick(this.props.textureId)
      }}
      style={{transform: transformContainer, width: desiredWidth, height: desiredHeight, ...this.props.style}}
    >
      <div className="Sprite" style = {{
          backgroundImage,
          backgroundPositionY,
          backgroundPositionX,
          width,
          height,
          transform,
          position:"relative",
          ...tintStyle
        }}>
      </div>
    </div>
  }
}
*/