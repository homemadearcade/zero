import React from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import ContextMenu from '../../components/ContextMenu/ContextMenu';

import SaveGameButton from '../SaveGameButton/SaveGameButton';
import GameView from '../GameView/GameView';

const GameEditor = ({lobbyId, gameModel, isHost, isNetworked, leftColumn, rightColumn, children, overlay}) => {
  return (
    <div className="GameEditor">
      <ContextMenu/>
      <div className="GameEditor__left-column">
        {leftColumn}
        <SaveGameButton/>
      </div>
      {gameModel && <GameView lobbyId={lobbyId} isHost={isHost} isNetworked={isNetworked} gameModel={gameModel}/>}
      {!gameModel && <div className="GameEditor__empty-game"></div>}
      <div className="GameEditor__right-column">{rightColumn}</div>
      {children}
      <div className="GameEditor__overlay">
        {overlay}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, {  })(GameEditor);