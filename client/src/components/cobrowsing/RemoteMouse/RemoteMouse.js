import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './RemoteMouse.scss';

const RemoteMouse = ({userId, lobby: { cobrowsingMouse} }) => {
  const mouseData = cobrowsingMouse[userId];

  if(!mouseData) {
    return null
  }

  const top = mouseData.pageY;
  const left =  window.innerWidth * mouseData.xPercent;

  return (
    <div className="RemoteMouse" style={{top, left}}>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { }),
)(RemoteMouse);
