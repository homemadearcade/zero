import { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils";

function AgoraVideoCommandReciever({tracks, video: { cutVideo, cutAudio }}) {
  useEffect(() => {
    if(tracks) {
      tracks[1].setEnabled(!cutVideo);
      tracks[0].setEnabled(!cutAudio);
    }
  }, [cutVideo, cutAudio, tracks])

  return null
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  video: state.video
});

export default compose(
  connect(mapStateToProps, {  }),
)(AgoraVideoCommandReciever);