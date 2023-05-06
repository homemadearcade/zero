// import classnames from 'classnames'
// import { SpriteSheet } from 'react-spritesheet'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import './KeyIndicator.scss'
import Typography from '../../../ui/Typography/Typography'
import classNames from 'classnames'

const KeyIndicator = ({
  keyName,
  className,
  blink
}) => {
  // if(GAME.keysDown[keyName]) {
  //   keyName+= '--pressed'
  // }

  // if(span) {
  //   return <span className={classnames("ReactSpriteSheet", this.props.className)}>
  //     <SpriteSheet filename="/assets/images/KeyUI.png" data={KeySpriteSheetData} sprite={key}/>
  //   </span>
  // }

 return <div className={classNames(className, "KeyIndicator", {
    "blink": blink
  })}>
    <Typography font="2P">
      x
    </Typography>
  </div>
  // return <div className={classnames("KeyIndicator", className)}>
  //   <SpriteSheet filename="/assets/images/KeyUI.png" data={KeySpriteSheetData} sprite={keyName}/>
  // </div>
}

const mapStateToProps = (state) => ({

})


export default compose(
  connect(mapStateToProps, { }),
)(KeyIndicator);
