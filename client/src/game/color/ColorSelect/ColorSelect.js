/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ColorSelect.scss';
import Button from '../../../components/ui/Button/Button';
import _ from 'lodash';
import classNames from 'classnames';
import Icon from '../../../components/ui/Icon/Icon';
import BorderedGrid from '../../../components/ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../../components/cobrowsing/Unlockable/Unlockable';

const ColorSelect = ({
  colors = [],
  onSelectColor,
  onAddColor,
  selectedColorHex,
  onUnselectColor,
  maxColors
}) => {

  const defaultColors = [
    '#EE4035', '#F37736', '#FDF498', '#7BC043', '#0392CF'
  ]

  const suggestedColors = _.uniq([...[...colors].reverse(), ...defaultColors]).slice(0, maxColors)
  const [isHoveringHex, setIsHoveringHex] = useState()

  const items = suggestedColors.map((hex) => {
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
      style={{backgroundColor: hex}}>
        {isSelected && isHovering && <Icon className="ColorSelect__color_unselect" icon="faClose"/>}
    </div>
  }).slice(0, maxColors)

  items.push(<Unlockable isTiny interfaceId="addColor"><Button size="fit" onClick={onAddColor}>
    +
  </Button></Unlockable>)

  return <div className="ColorSelect">
    <BorderedGrid
    maxItems={maxColors} 
    size="2.15vh"
    items={items}
    />
  </div>
};

const mapStateToProps = (state) => ({
});

export default compose(
  connect(mapStateToProps, { }),
)(ColorSelect);
