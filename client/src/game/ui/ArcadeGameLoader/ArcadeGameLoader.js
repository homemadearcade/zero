import React from 'react';
import LinearIndeterminateLoader from '../../../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';
import Typography from '../../../ui/Typography/Typography';
import GameViewEmpty from '../../view/GameViewEmpty/GameViewEmpty';

import './ArcadeGameLoader.scss';

        // <div className="GameEditor">
        //   <div className="GameEditor__left-column"/>
        //   <div className="ArcadeGameLoader__game-view-empty">
        //     <GameViewEmpty>
        //     <Typography font="2P" variant="body2">{props.text || 'Loading..'}</Typography>
        //   </GameViewEmpty>
        //   </div>
    
        //   <div className="GameEditor__right-column"/>
        // </div>
const ArcadeGameLoader = (props) => {
  return (
    <div className="ArcadeGameLoader" {...props}>
      <LinearIndeterminateLoader/>
      <div className='ArcadeGameLoader__body'>

      </div>
    </div>
  );
};

export default ArcadeGameLoader;
