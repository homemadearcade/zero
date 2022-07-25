import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LocalGameToolbar.scss';
import ToolbarIcon from '../../app/ui/ToolbarIcon/ToolbarIcon';

const LocalGameToolbar = ({ game: { gameInstance } }) => {
  const [isPaused, setIsPaused] = useState(false)
  const [isEditModeOn, setIsEditModeOn] = useState(false)

  if(!gameInstance) return

  function getScene() {
    const scene = gameInstance.scene?.scenes[0]

    return scene
  }

  return <div className="LocalGameToolbar">
    <ToolbarIcon 
      size="lg"
      icon={isPaused ? "faPlay" : "faPause"} 
      onClick={() => {
        const scene = getScene()
        scene.isPaused = !scene.isPaused
        setIsPaused(scene.isPaused)
      }}
    />
    <ToolbarIcon 
      size="lg"
      icon="faRotateRight"
      onClick={() => {
        getScene().reload()
      }}
    />
    <ToolbarIcon 
      size="lg"
      icon="faHammer"
      color={isEditModeOn ? "green" : 'white'}
      onClick={() => {
        const scene = getScene()
        scene.isEditModeOn = !scene.isEditModeOn
        setIsEditModeOn(scene.isEditModeOn)
      }}
    />
  </div>
};

const mapStateToProps = (state) => ({
  game: state.game
});

export default compose(
  connect(mapStateToProps, { }))(LocalGameToolbar);
