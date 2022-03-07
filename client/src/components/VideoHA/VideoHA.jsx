import React, { useEffect, useState } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './styles.scss'
import { useVideo } from "../../store/actions/videoActions";

const VideoHA = ({channelId, user}) => {
  return (
    <div>
      <VideoCall userId={user.id} channelName={channelId} />
    </div>
  );
};

const VideoCall = (props) => {
  let [ tracks, users ] = useVideo()

  return (
    <div className="App">
      {tracks && false && (
        <Controls tracks={tracks}/>
      )}
      {tracks && <Videos users={users} tracks={tracks} />}
    </div>
  );
};

const Videos = (props) => {
  const { users, tracks } = props;

  return (
    <div>
      <div id="videos">
        {/* AgoraVideoPlayer component takes in the video track to render the stream,
            you can pass in other props that get passed to the rendered div */}
        <AgoraVideoPlayer style={{height: '200px', width: '200px'}} className='vid' videoTrack={tracks[1]} />
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <AgoraVideoPlayer style={{height: '200px', width: '200px'}} className='vid' videoTrack={user.videoTrack} key={user.uid} />
              );
            } else return null;
          })}
      </div>
    </div>
  );
};

export const Controls = (props) => {
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

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default compose(
  connect(mapStateToProps),
)(VideoHA);