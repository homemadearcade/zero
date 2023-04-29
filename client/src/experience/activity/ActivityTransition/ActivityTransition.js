/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import ConstellationZoom from '../../../marketing/homemadeArcade/ConstellationZoom/ConstellationZoom';
import useGameEditorSize from '../../../hooks/useGameEditorSize';

const ActivityTransition = ({
  lobbyInstance: { lobbyInstance: { members }},
  auth: { me },
  cobrowsing: { cobrowsingUser, isActivelyCobrowsing }
}) => {
  const member = members.filter((member) => {
    if(cobrowsingUser?.id === member.userMongoId) {
      return true
    }
    return false;
  })[0]

  const { gameEditorWidth, gameEditorHeight } = useGameEditorSize()

  if(gameEditorHeight && gameEditorWidth && member?.inTransitionView && (isActivelyCobrowsing || cobrowsingUser.id === me.id)) {
    return <ConstellationZoom width={gameEditorWidth} height={gameEditorHeight}/>
  }
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
  cobrowsing: state.cobrowsing,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(ActivityTransition);
