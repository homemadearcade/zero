import React, { useEffect } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoSetup.scss'
import { bypassAgoraVideoCall, useMicrophoneAndCameraTracks } from "../../../store/actions/videoActions";
import { startAgoraVideoCall } from "../../../store/actions/videoActions";
import Button from "../../../ui/Button/Button";
import Typography from "../../../ui/Typography/Typography";
import { isLocalHost } from "../../../utils/webPageUtils";
import AgoraVideoPreview from "../AgoraVideoPreview/AgoraVideoPreview";

const AgoraVideoSetup = ({startAgoraVideoCall, bypassAgoraVideoCall}) => {
  const { tracks, ready } = useMicrophoneAndCameraTracks();

  return <div className="AgoraVideoSetup">
    {!ready && <div className="AgoraVideoSetup__popup">
      <Typography component="h5" variant="h5">A window should popup in your browser asking permission to use your camera. Please click 'Allow'.</Typography>
    </div>}
    {ready && <div className="AgoraVideoSetup__preview">
      <AgoraVideoPreview/>
      <Button onClick={() => {
        startAgoraVideoCall(tracks)
      }}>
        Enter Lobby with Video
      </Button>
      {isLocalHost() && <Button onClick={() => {
        bypassAgoraVideoCall()
      }}>
        Bypass Video
      </Button>}
    </div>
  }
  </div>
}


const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { startAgoraVideoCall, bypassAgoraVideoCall }),
)(AgoraVideoSetup);

