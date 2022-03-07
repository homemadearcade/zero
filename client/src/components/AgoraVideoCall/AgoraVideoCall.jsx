import React, { useEffect, useState } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './AgoraVideoCall.scss'
import { useAgoraVideoCall } from "../../store/actions/videoActions";

const AgoraVideoCall = ({userId, lobbyId, render}) => {
  let [ tracks, users ] = useAgoraVideoCall({userId, lobbyId})
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const muteVideo = async () => {
    await tracks[1].setEnabled(!trackState.video);
    setTrackState((ps) => {
      return { ...ps, video: !ps.video };
    });
  };

  console.log(trackState.audio)


  const muteAudio = async () => {
    console.log('XXX')
    await tracks[0].setEnabled(!trackState.audio);
    setTrackState((ps) => {
      return { ...ps, audio: !ps.audio };
    });
  };

  return (
    <div className="AgoraVideoCall">
      {tracks && render({ myTracks: tracks, userTracks: users, isAudioMuted: !trackState.audio, isVideoMuted: !trackState.video, muteVideo, muteAudio })}
    </div>
  );
};

// {tracks && <Videos users={users} tracks={tracks} />}
// {tracks && false && (
//   <Controls tracks={tracks}/>
// )}

const Videos = (props) => {
  const { users, tracks } = props;

  return (
    <div>
      <div id="videos">
        {/* AgoraVideoPlayer component takes in the video track to render the stream,
            you can pass in other props that get passed to the rendered div */}
        <AgoraVideoPlayer style={{height: '200px', width: '200px'}} className='vid' videoTrack={tracks[1]} />

      </div>
    </div>
  );
};

const Controls = (props) => {
  const { tracks } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  return (
    <div className="controls">
      <p className={trackState.audio ? "on" : ""}
        onClick={() => mute("audio")}>
        {trackState.audio ? "MuteAudio" : "UnmuteAudio"}
      </p>
      <p className={trackState.video ? "on" : ""}
        onClick={() => mute("video")}>
        {trackState.video ? "MuteVideo" : "UnmuteVideo"}
      </p>
    </div>
  );
};

function mapStateToProps() {
  return { };
}

export default compose(
  connect(mapStateToProps),
)(AgoraVideoCall);