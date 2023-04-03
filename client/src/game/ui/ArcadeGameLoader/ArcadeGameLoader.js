import React from 'react';
import Typography from '../../../ui/Typography/Typography';
import GameViewEmpty from '../../view/GameViewEmpty/GameViewEmpty';

import './ArcadeGameLoader.scss';

const ArcadeGameLoader = (props) => {
  return (
    <div className="ArcadeGameLoader" {...props}>
      <div className='ArcadeGameLoader__body'>
        <div className="GameEditor">
          <div className="GameEditor__left-column"/>
          <div className="ArcadeGameLoader__game-view-empty">
            <GameViewEmpty>
            <Typography component="h3" font="2P" variant="body1">{props.text || 'Loading..'}</Typography>
          </GameViewEmpty>
          </div>
    
          <div className="GameEditor__right-column"/>
        </div>
      </div>
    </div>
  );
};

export default ArcadeGameLoader;
