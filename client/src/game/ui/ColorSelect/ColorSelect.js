/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ColorSelect.scss';
import Button from '../../../app/ui/Button/Button';
import _ from 'lodash';
import classNames from 'classnames';

const ColorSelect = ({
  colors = [],
  onSelectColor,
  onAddColor,
  selectedColorHex,
  onUnselectColor
}) => {

  const maxColors = 10

  const defaultColors = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#00FFFF',
    '#FF00FF'
  ]

  const suggestedColors = _.uniq([...colors.reverse(), ...defaultColors].slice(0, maxColors))

  return <div className="ColorSelect">
    {suggestedColors.map((hex) => {
      const isSelected = selectedColorHex === hex
      return <div 
        onClick={() => {
          if(isSelected) {
            if(onUnselectColor) onUnselectColor(hex)
          } else {
            onSelectColor(hex)
          }
        }} 
        key={hex} 
        className={classNames("ColorSelect__color", {' ColorSelect__color--selected': isSelected })} 
        style={{backgroundColor: hex}}>
          
      </div>
    })}
    <Button className="ColorSelect__add" onClick={onAddColor}>
      +
    </Button>
  </div>
};

const mapStateToProps = (state) => ({
});

export default compose(
  connect(mapStateToProps, { }),
)(ColorSelect);
