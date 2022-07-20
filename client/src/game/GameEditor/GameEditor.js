import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import ContextMenu from '../../app/ui/ContextMenu/ContextMenu';

// import SaveGameButton from '../SaveGameButton/SaveGameButton';
import GameView from '../GameView/GameView';
import LiveEditor from '../LiveEditor/LiveEditor';
import { clearEditor } from '../../store/actions/editorActions';
import { clearEditorForms } from '../../store/actions/editorFormsActions';
import { getRemoteCobrowsingState } from '../../utils/cobrowsing';

const GameEditor = ({gameModel, editorState: { isLiveEditorOpen }, isHost, isNetworked, leftColumn, rightColumn, children, overlay, clearEditor, clearEditorForms}) => {
  useEffect(() => {
    return () => {
      clearEditor()
      clearEditorForms()
    }
  }, [])

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

const mapStateToProps = (state) => getRemoteCobrowsingState(state, {
  editorState: state.editor.editorState,
})

export default connect(mapStateToProps, { clearEditor, clearEditorForms })(GameEditor);