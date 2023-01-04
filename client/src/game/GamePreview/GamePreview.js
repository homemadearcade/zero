import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamePreview.scss';
import withGame from '../../hoc/withGame';
import GameView from '../../game/GameView/GameView';
import GameStatus from '../../app/homemadeArcade/arcadeGame/GameStatus/GameStatus';
import { loadCobrowsingPreview } from '../../store/actions/cobrowsingActions';

const GamePreview = ({children, userId, loadCobrowsingPreview}) => {
  useEffect(() => {
    if(userId) {
      loadCobrowsingPreview(userId)
    }
  }, [userId])

  return (
    <div className="GamePreview">
      <GameView
        isHost={false}
        isNetworked={true}
      />
      {children}
      <div className="GamePreview__note"><GameStatus/></div>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  withGame,
  connect(mapStateToProps, { loadCobrowsingPreview })
)(GamePreview);
