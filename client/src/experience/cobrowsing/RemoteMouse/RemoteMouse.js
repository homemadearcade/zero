import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './RemoteMouse.scss';
import { clearErrorState, changeErrorState } from '../../../store/actions/errorsActions';

const RemoteMouse = ({userMongoId, status: { cobrowsingMouses}}) => {
  const mouseData = cobrowsingMouses[userMongoId];

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
  cobrowsing: state.cobrowsing,
  status: state.status,
  errors: state.errors
});

export default compose(
  connect(mapStateToProps, { clearErrorState, changeErrorState }),
)(RemoteMouse);
