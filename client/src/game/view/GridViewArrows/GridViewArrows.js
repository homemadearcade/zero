import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './GridViewArrows.scss';

import { getCurrentGameScene } from '../../../utils/editorUtils';
import Icon from '../../../ui/Icon/Icon';
import store from '../../../store';
import { getThemePrimaryColor } from '../../../utils/webPageUtils';

const scrollDelta = 3;

const GridViewArrows = () => {
  const [overArrow, setOverArrow] = useState(null)

  useEffect(() => {
    const cameraMoveInterval = setInterval(() => {
      if(overArrow) {
        const scene = getCurrentGameScene(store.getState().webPage.gameInstance)
        if(scene) {
          const editorCamera = scene.editorCamera
          if(overArrow === 'left') {
            editorCamera.scrollX -= scrollDelta
          }
          if(overArrow === 'right') {
            editorCamera.scrollX += scrollDelta
          }
          if(overArrow === 'top') {
            editorCamera.scrollY -= scrollDelta
          }
          if(overArrow === 'bottom') {
            editorCamera.scrollY += scrollDelta
          }
        }
      }
    }, 10)
    return () => {
      clearInterval(cameraMoveInterval)
    }
  })
  const color = getThemePrimaryColor().hexString

  return <>
    <div 
      style={{color}}
      className="GridViewArrows__arrow GridViewArrows__left" 
      onMouseEnter={() => {
        setOverArrow('left')
      }}
      onMouseLeave={() => {
        setOverArrow(null)
      }}
    >
      <Icon icon="faArrowLeft" size="sm"></Icon>
    </div>
    <div 
      style={{color}}
      className="GridViewArrows__arrow GridViewArrows__right"
      onMouseEnter={() => {
        setOverArrow('right')
      }}
      onMouseLeave={() => {
        setOverArrow(null)
      }}
    >
      <Icon icon="faArrowRight" size="sm"></Icon>
    </div>
    <div 
      style={{color}}
      className="GridViewArrows__arrow GridViewArrows__top"
      onMouseEnter={() => {
        setOverArrow('top')
      }}
      onMouseLeave={() => {
        setOverArrow(null)
      }}
    >
      <Icon icon="faArrowUp" size="sm"></Icon>
    </div>
    <div 
      style={{color}}
      className="GridViewArrows__arrow GridViewArrows__bottom"
      onMouseEnter={() => {
        setOverArrow('bottom')
      }}
      onMouseLeave={() => {
        setOverArrow(null)
      }}
    >
      <Icon icon="faArrowDown" size="sm"></Icon>
    </div>
  </>
}

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { })(GridViewArrows);