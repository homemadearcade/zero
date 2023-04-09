/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import './WaitingActivity.scss'
import { ACTIVITY_VIEW_MY_INFORMATION, ACTIVITY_VIEW_TEXT } from '../../../constants';
import { Container } from '@mui/material';
import Typography from '../../../ui/Typography/Typography';
import AgoraVideoPreview from '../../agora/AgoraVideoPreview/AgoraVideoPreview';

const WaitingActivity = ({
  currentViewCategory,
  myTracks,
  video: { isInsideVideoCall },
}) => {
  function renderView() {
    if(currentViewCategory === ACTIVITY_VIEW_TEXT) {
      return <Typography variant="h5">Your experience will start shortly. For the best experience please spend this time closing all other browser tabs, closing other applications, and putting your notifications on quiet.</Typography>
    }

    if(currentViewCategory === ACTIVITY_VIEW_MY_INFORMATION) {
      return <div>
        {isInsideVideoCall && <AgoraVideoPreview tracks={myTracks}/>}
      </div>
    }
  }

  return <Container><div className="WaitingActivity">
    {renderView()}
  </div>
  </Container>

};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
  video: state.video,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(WaitingActivity);
