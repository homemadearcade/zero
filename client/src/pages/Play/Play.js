import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameView from '../../game/GameView/GameView';

import './Play.scss';

import { requestFullscreen } from '../../store/actions/browserActions';

const Play = ({ requestFullscreen }) => {
  return (
    <div className="Play">
      <GameView 
        leftColumn={<div>
          {!window.isFullscreen && <div onClick={() => {
            requestFullscreen()
          }}>
            <i className="fas fa-expand Play__fullscreen"/>
          </div>}
        </div>}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  // auth: state.auth,
});

export default compose(connect(mapStateToProps, { requestFullscreen }))(Play);
