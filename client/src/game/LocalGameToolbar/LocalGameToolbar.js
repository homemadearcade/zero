import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LocalGameToolbar.scss';
import ToolbarIcon from '../../app/ui/ToolbarIcon/ToolbarIcon';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { toggleGridView } from '../../store/actions/editorActions';

const LocalGameToolbar = ({  game: { gameInstance }, undoLastInstanceChange }) => {
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
    <ToolbarIcon 
      size="lg"
      icon="faRotateLeft"
      onClick={() => {
        undoLastInstanceChange()
      }}
    />
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
  game: state.game,
});

export default compose(
  connect(mapStateToProps, { toggleGridView }))(LocalGameToolbar);
