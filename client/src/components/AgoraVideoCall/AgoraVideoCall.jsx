import React, { useState } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoCall.scss'
import { useAgoraVideoCall } from "../../store/actions/videoActions";

import { onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess } from '../../store/actions/videoActions';

const AgoraVideoCall = ({onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, lobbyId, auth: { me }, render}) => {
  console.log('rerender')
  let [ tracks, users, myNetworkQuality, remoteNetworkQuality ] = useAgoraVideoCall({userId: me.id, lobbyId, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess })
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const muteVideo = async () => {
    try {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    } catch(e) {
      console.error(e)
    }

  };

  const muteAudio = async () => {
    try{
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } catch(e) {
      console.error(e)
    }
  };

  return (
    <div className="AgoraVideoCall">
      {tracks && render({ myTracks: tracks, userTracks: users, isAudioMuted: !trackState.audio, isVideoMuted: !trackState.video, muteVideo, muteAudio, myNetworkQuality, remoteNetworkQuality })}
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

