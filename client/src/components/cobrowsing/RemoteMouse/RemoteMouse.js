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
  let left =  mouseData.xPercent * window.innerWidth//window.innerWidth;

  // let left;

  // const percentFromCenter = Math.abs(mouseData.xPercent - .5)
  // const pixelsFromCenter = (window.innerWidth * percentFromCenter) * (window.innerHeight/mouseData.windowHeight)

  // if(mouseData.xPercent >= .5) {
  //   left = (window.innerWidth/2) + pixelsFromCenter
  // } else {
  //   left = (window.innerWidth/2) - pixelsFromCenter
  // }

  // console.log(mouseData.xPercent, mouseData.windowHeight/window.innerHeight, mouseData.xPercent * (mouseData.windowHeight/window.innerHeight))
  // console.log(mouseData.clientX, (mouseData.windowHeight/window.innerHeight))  
  // if(mouseData.xPercent >= window.innerWidth/2) {
  //   left = left * (window.innerHeight/mouseData.windowHeight)
  // } else {
  //   left = left * window.innerWidth * mouseData.xPercent
  // }
  //* ;

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
