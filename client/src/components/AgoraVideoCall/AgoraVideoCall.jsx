import React from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoCall.scss'
import { useAgoraVideoCall } from "../../store/actions/videoActions";

import { onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess } from '../../store/actions/videoActions';

const AgoraVideoCall = ({onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, lobbyId, auth: { me }, render}) => {
  let [tracks, users] = useAgoraVideoCall({userId: me.id, lobbyId, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess })

  return (
    <div className="AgoraVideoCall">
      {tracks && render({ myTracks: tracks, userTracks: users })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobbyId: state.lobby.lobby.id
});

export default compose(
  connect(mapStateToProps, { onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess }),
)(AgoraVideoCall);

