import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import ContextMenu from '../../components/ui/ContextMenu/ContextMenu';

// import SaveGameButton from '../SaveGameButton/SaveGameButton';
import GameView from '../GameView/GameView';
import LiveEditor from '../LiveEditor/LiveEditor';
import { closeLiveEditor } from '../../store/actions/editorActions';
import { getSpritesheetData } from '../../store/actions/gameActions';

const GameEditor = ({gameModel, spritesByDescriptor, getSpritesheetData, editorState: { isLiveEditorOpen }, isHost, isNetworked, leftColumn, rightColumn, children, overlay, closeLiveEditor}) => {
  useEffect(() => {
    getSpritesheetData()

    return () => {
      closeLiveEditor()
    }
  }, [])

  if(!spritesByDescriptor) return null

  return (
    <div className="GameEditor">
      <ContextMenu/>
      <div className="GameEditor__left-column">
        {leftColumn}
      </div>
      {gameModel && <GameView isHost={isHost} isNetworked={isNetworked}/>}
      {!gameModel && <div className="GameEditor__empty-game"></div>}
      <div className="GameEditor__right-column">
        {rightColumn}
      </div>
      {children}
      <div className="GameEditor__overlay">
        {overlay}
      </div>
      {isLiveEditorOpen && <LiveEditor/>}
    </div>
  );
};

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  // console.log(isCobrowsing, isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState)
  return {
    spritesByDescriptor: state.game.spritesByDescriptor,
    editorState: isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState,
  }
};

export default connect(mapStateToProps, { closeLiveEditor, getSpritesheetData  })(GameEditor);