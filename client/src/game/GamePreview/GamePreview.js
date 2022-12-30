import React, { } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamePreview.scss';
import withGame from '../../hoc/withGame';
import GameView from '../../game/GameView/GameView';

const GamePreview = ({children}) => {
  return (
    <div className="GamePreview">
      <GameView
        isHost={false}
        isNetworked={true}
      />
      {children}
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  withGame,
  connect(mapStateToProps, {  })
)(GamePreview);
