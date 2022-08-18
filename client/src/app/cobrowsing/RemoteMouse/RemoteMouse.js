import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './RemoteMouse.scss';

const RemoteMouse = ({userId, status: { cobrowsingMouses} }) => {
  const mouseData = cobrowsingMouses[userId];

  if(!mouseData) {
    return null
  }

  const top = (Number(mouseData.yPercent) * 100).toString() + '%';
  const left =  (Number(mouseData.xPercent) * 100).toString() + "%"//window.innerWidth;

  const style = {
    top,
    left
  }
  
  if(mouseData.didClick) {
    style.backgroundColor =  'white';
    style.transform = 'scale(0.5)'
  }

  return (
    <div className="RemoteMouse" style={style}>
    </div>
  );
};

const mapStateToProps = (state) => ({
  status: state.status
});

export default compose(
  connect(mapStateToProps, { }),
)(RemoteMouse);
