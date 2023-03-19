/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import './GameViewEmpty.scss'

const GameViewEmpty = ({
  children,
}) => {
  return <div
    className="GameViewEmpty"
  >
    {children}
  </div> 
};

export default GameViewEmpty