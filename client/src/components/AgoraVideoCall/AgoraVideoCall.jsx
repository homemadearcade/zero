import React, { useEffect, useState } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './AgoraVideoCall.scss'
import { useAgoraVideoCall } from "../../store/actions/videoActions";

const AgoraVideoCall = ({lobbyId, auth: { me }, render}) => {
  let [ tracks, users, myNetworkQuality, remoteNetworkQuality ] = useAgoraVideoCall({userId: me.id, lobbyId})
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const muteVideo = async () => {
    await tracks[1].setEnabled(!trackState.video);
    setTrackState((ps) => {
      return { ...ps, video: !ps.video };
    });
  };

  const muteAudio = async () => {
    await tracks[0].setEnabled(!trackState.audio);
    setTrackState((ps) => {
      return { ...ps, audio: !ps.audio };
    });
  };

  return (
    <div className="AgoraVideoCall">
      {tracks && render({ myTracks: tracks, userTracks: users, isAudioMuted: !trackState.audio, isVideoMuted: !trackState.video, muteVideo, muteAudio, myNetworkQuality, remoteNetworkQuality })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, {}),
)(AgoraVideoCall);

