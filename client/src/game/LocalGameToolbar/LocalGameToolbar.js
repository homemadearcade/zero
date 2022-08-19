import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LocalGameToolbar.scss';
import ToolbarIcon from '../../app/ui/ToolbarIcon/ToolbarIcon';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { toggleGridView } from '../../store/actions/editorActions';

const LocalGameToolbar = ({ toggleGridView, game: { gameInstance }, editor: { isGridViewOn} }) => {
  const [isPaused, setIsPaused] = useState(false)

  if(!gameInstance) return

  return <div className="LocalGameToolbar">
    <ToolbarIcon 
      size="lg"
      icon="faTableCells"
      color={isGridViewOn ? "green" : 'white'}
      onClick={() => {
        toggleGridView()
      }}
    />
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
      icon="faRotateRight"
      onClick={() => {
        getCurrentGameScene(gameInstance).reload()
      }}
    />
  </div>
};

const mapStateToProps = (state) => ({
  game: state.game,
  editor: state.editor
});

export default compose(
  connect(mapStateToProps, { toggleGridView }))(LocalGameToolbar);
