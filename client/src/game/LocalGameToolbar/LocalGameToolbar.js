import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LocalGameToolbar.scss';
import ToolbarIcon from '../../app/ui/ToolbarIcon/ToolbarIcon';
import { getCurrentGameScene } from '../../utils/editor';

const LocalGameToolbar = ({ game: { gameInstance } }) => {
  const [isPaused, setIsPaused] = useState(false)
  const [isEditModeOn, setIsEditModeOn] = useState(true)

  if(!gameInstance) return

  return <div className="LocalGameToolbar">
    <ToolbarIcon 
      size="lg"
      icon="faTableCells"
      color={isEditModeOn ? "green" : 'white'}
      onClick={() => {
        const scene = getCurrentGameScene(gameInstance)
        scene.isEditModeOn = !scene.isEditModeOn
        setIsEditModeOn(scene.isEditModeOn)
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
  game: state.game
});

export default compose(
  connect(mapStateToProps, { }))(LocalGameToolbar);
