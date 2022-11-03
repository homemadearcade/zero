import colorArrays from './colorArrays';
import React from 'react';
import './ColorGrid.scss'

// import { createColors } from '../../../utils/colors'

export default function ColorGrid({
  onClick
}) {
  function renderColorGridItem (hex) {
    return <span key={hex} 
      onClick={() => {
        onClick(hex)
      }} className="ColorGrid__item" 
      style={{backgroundColor: hex}}
    />
  }

  // const newColors = createColors()

  return <div className="ColorGrid">
    <div className="ColorGrid__greyscale">
      {['#FFFFFF', '#EEEEEE', '#DDDDDD', '#CCCCCC', '#BBBBBB', 
        '#AAAAAA', '#999999', '#888888', '#777777', '#666666', 
        '#555555', '#444444', '#333333', '#222222', '#111111', '#000000']
        .map(renderColorGridItem)}
    </div>
    <div className="ColorGrid__sections">
    {colorArrays.map((sortedColors, i) => {
      return <div key={i} className="ColorGrid__section">
        {sortedColors.map(renderColorGridItem)}
      </div>
    })}
    </div>
  </div>
}

//<span className="ColorGrid__name">{findColorNameByHex(hex)}</span>
