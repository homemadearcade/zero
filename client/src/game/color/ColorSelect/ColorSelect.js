/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ColorSelect.scss';
import Button from '../../../ui/Button/Button';
import _ from 'lodash';
import classNames from 'classnames';
import Icon from '../../../ui/Icon/Icon';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { ADD_COLOR_IID } from '../../../constants/interfaceIds';

const ColorSelect = ({
  colors = [],
  onSelectColor,
  onAddColor,
  selectedColorHex,
  onUnselectColor,
  maxColors,
  canvasId,
}) => {

  const defaultColors = [
    '#EE4035', '#F37736', '#FDF498', '#7BC043', '#0392CF'
  ]

  function ColorItem({width, height, hex}) {
    const isSelected = selectedColorHex === hex
    const isHovering = isHoveringHex === hex

    return <div 
      onClick={() => {
        if(isSelected) {
          if(onUnselectColor) onUnselectColor(hex)
        } else {
          onSelectColor(hex)
        }
      }} 
      onMouseEnter={() => {
        setIsHoveringHex(hex)
      }}
      onMouseLeave={() => {
        setIsHoveringHex(null)
      }}
      key={hex} 
      className={classNames("ColorSelect__color", {' ColorSelect__color--selected': isSelected })} 
      style={{backgroundColor: hex, width: width? width: null, height: height? height: null}}>
        {isSelected && isHovering && <Icon className="ColorSelect__color_unselect" icon="faClose"/>}
    </div>
  }

  const suggestedColors = _.uniq([...[...colors].reverse(), ...defaultColors]).slice(0, maxColors)
  const [isHoveringHex, setIsHoveringHex] = useState()

  const items = suggestedColors.map((hex) => {

    const el = <ColorItem hex={hex}></ColorItem>

    if(canvasId) {
      return <Unlockable interfaceId={canvasId + '/colorSelect'}>
        {el}
      </Unlockable>
    }

    return el
  }).slice(0, maxColors)

  items.push(<Unlockable isTiny interfaceId={ADD_COLOR_IID}><Button size="fit" onClick={onAddColor}>
    +
  </Button></Unlockable>)

  return <div className="ColorSelect">
    <BorderedGrid
    maxItems={maxColors} 
    width="2.15vh"
    height="2.15vh"
    items={items}
    />
  </div>
};

const mapStateToProps = (state) => ({
});

export default compose(
  connect(mapStateToProps, { }),
)(ColorSelect);
