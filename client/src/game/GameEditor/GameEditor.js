import React from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import ContextMenu from '../../components/ContextMenu/ContextMenu';

import SaveGameButton from '../SaveGameButton/SaveGameButton';
import GameView from '../GameView/GameView';
import LiveEditor from '../LiveEditor/LiveEditor';

const GameEditor = ({lobbyId, gameModel, editor: { editorState: { isLiveEditorOpen } }, isHost, isNetworked, leftColumn, rightColumn, children, overlay}) => {

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
        {isLiveEditorOpen && <LiveEditor/>}
      </div>
    </div>
  );
  
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, {  })(GameEditor);