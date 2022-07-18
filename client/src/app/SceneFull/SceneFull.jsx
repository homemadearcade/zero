import React from 'react';
import './SceneFull.scss';

const SceneFull = ({text, onClick}) => {
  return (
    <div className="SceneFull" onClick={onClick}>
      <div className="SceneFull__text">{text}</div>
    </div>
  );
};

export default SceneFull