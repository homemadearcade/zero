import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingStatus.scss';

const CobrowsingStatus = ({ onClose, auth: { me }, lobby: { cobrowsingUser, cobrowsingMouse } }) => {
  const mouseData = cobrowsingMouse[cobrowsingUser.id];

  if(cobrowsingUser.id === me.id) {
    return (
      <div className="CobrowsingStatus">
        <span className="CobrowsingStatus__close" onClick={onClose}>close</span>
      </div>
    );
  }

  return (
    <div className="CobrowsingStatus">
      <span className="CobrowsingStatus__username">{cobrowsingUser.username}</span>
      <span className="CobrowsingStatus__ping">{mouseData?.lastPing ? <span>{((Date.now() - mouseData?.lastPing)/1000).toFixed(0)}s</span> : 'never'}</span>
      <span className="CobrowsingStatus__close" onClick={onClose}>close</span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, {}),
)(CobrowsingStatus);
