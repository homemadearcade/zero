import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LocalGameToolbar.scss';
import ToolbarIcon from '../../components/ui/ToolbarIcon/ToolbarIcon';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { toggleGridView } from '../../store/actions/gameViewEditorActions';
import UndoButton from '../../components/ui/UndoButton/UndoButton';
import { onInstanceUndo } from '../../store/actions/lobbyActions';

const LocalGameToolbar = ({ webPage: { gameInstance } }) => {
  const [isPaused, setIsPaused] = useState(false)

  if(!gameInstance) return

  return <div className="LocalGameToolbar">
    <ToolbarIcon 
      size="lg"
      icon={isPaused ? "faPlay" : "faPause"} 
      onClick={() => {
        const scene = getCurrentGameScene(gameInstance)
        scene.isPaused = !scene.isPaused
        setIsPaused(scene.isPaused)
      }}
    />
    <UndoButton onClick={onInstanceUndo} />
    <ToolbarIcon 
      size="lg"
      icon="faStop"
      onClick={() => {
        getCurrentGameScene(gameInstance).reload()
      }}
    />
  </div>
};

const mapStateToProps = (state) => ({
  webPage: state.webPage,
});

export default compose(
  connect(mapStateToProps, { toggleGridView }))(LocalGameToolbar);
