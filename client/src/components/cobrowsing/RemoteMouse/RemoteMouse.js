import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './RemoteMouse.scss';

const RemoteMouse = ({userId, status: { cobrowsingMouse} }) => {
  const mouseData = cobrowsingMouse[userId];

  if(!mouseData) {
    return null
  }

  const top = window.innerHeight * mouseData.yPercent;
  const left =  window.innerWidth * mouseData.xPercent;

  return (
    <div className="RemoteMouse" style={{top, left}}>
    </div>
  );
};

const mapStateToProps = (state) => ({
  status: state.status
});

export default compose(
  connect(mapStateToProps, { }),
)(RemoteMouse);
