import React from 'react'
import tinycolor from 'tinycolor2'
import { getTextureMetadata, getSpriteTexture } from '../../../utils/utils'
import './Sprite.scss'

export default class Sprite extends React.Component {
  render() {
    const { spriteSheetName } = getTextureMetadata(this.props.textureId)
    const texture = getSpriteTexture(this.props.textureId)

    let desiredWidth = this.props.width
    let desiredHeight = this.props.height

    if(!desiredWidth) {
      if(texture) {
        desiredWidth = (texture.width * 4)
      } else desiredWidth = 40
    }

    if(!desiredHeight) {
      if(texture) {
        desiredHeight = (texture.height * 4)
      } else desiredHeight = 40
    }

    if(!texture) {
      return <div style={{width: desiredWidth, height: desiredHeight}}></div>
    }

    const backgroundImage = "url('/"+window.spriteSheets[spriteSheetName].serverImageUrl+"')"

    let backgroundColor = ""
    if(this.props.tint && this.props.tint != 'white' && this.props.tint != '#FFFFFF') {
      const alpha = tinycolor(this.props.tint).getAlpha()
      backgroundColor = tinycolor(this.props.tint).setAlpha(alpha - .1).toRgbString()
    }

    const backgroundPositionX = -texture.x
    const backgroundPositionY = -texture.y
    const width = texture.width
    const height = texture.height

    const scale = desiredWidth/width
    const translate = (desiredWidth - width)/2 + 'px'
    const translateY = (desiredHeight - height)/2 + 'px'

    const transform = `scale(${scale})`;

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
          position:"relative"
        }}>
          {backgroundColor && <div style={{
               backgroundColor,
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
             }}></div>}
      </div>
    </div>
  }
}
