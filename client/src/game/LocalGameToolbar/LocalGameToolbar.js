import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LocalGameToolbar.scss';
import ToolbarIcon from '../../app/ui/ToolbarIcon/ToolbarIcon';

const LocalGameToolbar = ({ game: { gameInstance } }) => {
  const [paused, setPaused] = useState(false)

  if(!gameInstance) return

  function getScene() {
    const scene = gameInstance.scene?.scenes[0]

    return scene
  }

  return <div className="LocalGameToolbar">
    <ToolbarIcon 
      size="lg"
      icon={paused ? "faPlay" : "faPause"} 
      onClick={() => {
        const scene = getScene()
        scene.paused = !scene.paused
        setPaused(scene.paused)
      }}
    />
    <ToolbarIcon 
      size="lg"
      icon="faRotateRight"
      onClick={() => {
        getScene().reload()
      }}
    />
  </div>
};

const mapStateToProps = (state) => ({
  game: state.game
});

export default compose(
  connect(mapStateToProps, { }))(LocalGameToolbar);
