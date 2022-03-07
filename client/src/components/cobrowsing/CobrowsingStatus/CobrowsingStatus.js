import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingStatus.scss';
import UserStatus from '../../UserStatus/UserStatus';
import { startAgoraVideoCall } from '../../../store/actions/videoActions';

const CobrowsingStatus = ({ startAgoraVideoCall, onClose, auth: {me}, cobrowsingUser }) => {
  if(cobrowsingUser.id === me.id) {
    return (
      <div className="CobrowsingStatus">
        <span className="CobrowsingStatus__close" onClick={onClose}>close</span>
      </div>
    );
  }

  return (
    <div className="CobrowsingStatus">
      <UserStatus userId={cobrowsingUser.id}/>
      <span className="CobrowsingStatus__close" onClick={onClose}>close</span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cobrowsingUser: state.lobby.cobrowsingUser,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { startAgoraVideoCall }),
)(CobrowsingStatus);
