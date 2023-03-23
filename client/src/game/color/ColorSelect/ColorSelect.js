/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ColorSelect.scss';
import Button from '../../../ui/Button/Button';
import _ from 'lodash';
import Icon from '../../../ui/Icon/Icon';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { ADD_COLOR_IID, getColorSelectFromLayerId } from '../../../constants/interfaceIds';
import EraserSelect from '../../ui/EraserSelect/EraserSelect';
import { getThemePrimaryColor } from '../../../utils/webPageUtils';
import { COLOR_BRUSH_ID, NON_LAYER_COLOR_ID } from '../../constants';
import { changeBrushIdHovering } from '../../../store/actions/hoverPreviewActions';
import { updateBrushLastUsedDate } from '../../../store/actions/gameSelectorActions';
import { useWishTheme } from '../../../hooks/useWishTheme';

const ColorSelect = ({
  colors = [],
  onSelectColor,
  onAddColor,
  changeBrushIdHovering,
  selectedColorHex,
  onUnselectColor,
  maxColors,
  layerId,
  withEraser,
  updateBrushLastUsedDate
}) => {
  useEffect(() => {
    return () => {
      changeBrushIdHovering(null)
    }
  }, [])

  const defaultColors = [
    '#FFFFFF', '#000000', '#EE4035', '#F37736', '#FDF498', '#7BC043', '#0392CF'
  ]

  const border = '1px solid ' + useWishTheme().primaryColor.hexString
  function ColorItem({width, height, hex, onClick}) {
    const [isHoveringHex, setIsHoveringHex] = useState()

    const isSelected = selectedColorHex === hex
    const isHovering = isHoveringHex === hex
    const brushId = COLOR_BRUSH_ID + '/' + layerId + '/' + hex

    function handleClick(e) {
      if(onClick) onClick(e)
      if(isSelected) {
        if(onUnselectColor) {
          onUnselectColor(hex)
        }
      } else {
        if(layerId) {
          // updateBrushLastUsedDate(brushId)
        }
        onSelectColor(hex)
      }
    }

    return <div 
      onMouseDown={handleClick} 
      onMouseEnter={() => {
        setIsHoveringHex(hex)
        changeBrushIdHovering(brushId)
      }}
      onMouseLeave={() => {
        changeBrushIdHovering(null)
        setIsHoveringHex(null)
      }}
      className={"ColorSelect__color"} 
      style={{
        backgroundColor: hex, width: width? width: null, height: height? height: null,
        border: isSelected ? border : null,
      }}>
        {isSelected && isHovering && <Icon className="ColorSelect__color_unselect" icon="faClose"/>}
    </div>
  }

  const suggestedColors = _.uniq([...[...colors].reverse(), ...defaultColors]).slice(0, maxColors)
  const items = suggestedColors.map((hex) => {

    const el = <ColorItem key={hex} hex={hex}></ColorItem>

    if(layerId !== NON_LAYER_COLOR_ID) {
      return <Unlockable interfaceId={getColorSelectFromLayerId(layerId)}>
        {el}
      </Unlockable>
    }

    return el
  }).slice(0, maxColors - 1)

  items.push(<Unlockable isTiny interfaceId={ADD_COLOR_IID}><Button size="fit" onClick={onAddColor}>
    +
  </Button></Unlockable>)

  if(withEraser && layerId) {
    items.unshift(<EraserSelect layerId={layerId}/>)
  }

  return <div className="ColorSelect">
    <BorderedGrid
    maxItems={maxColors} 
    width="1em"
    height="1em"
    items={items}
    />
  </div>
};

const mapStateToProps = (state) => ({
});

export default compose(
  connect(mapStateToProps, { changeBrushIdHovering, updateBrushLastUsedDate }),
)(ColorSelect);
