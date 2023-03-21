/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import ConstellationZoom from '../../../marketing/homemadeArcade/ConstellationZoom/ConstellationZoom';
import useGameEditorSize from '../../../hooks/useGameEditorSize';

const ActivityOverlay = ({
  lobby: { lobby: { members }},
  auth: { me },
  cobrowsing: { cobrowsingUser, isActivelyCobrowsing }
}) => {
  const user = members.filter(({id}) => {
    if(cobrowsingUser?.id === id) {
      return true
    }
    return false;
  })[0]

  const { gameEditorWidth, gameEditorHeight } = useGameEditorSize()

  if(gameEditorHeight && gameEditorWidth && user.inOverlayView && (isActivelyCobrowsing || cobrowsingUser.id === me.id)) {
    return <ConstellationZoom width={gameEditorWidth} height={gameEditorHeight}/>
  }
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(ActivityOverlay);
