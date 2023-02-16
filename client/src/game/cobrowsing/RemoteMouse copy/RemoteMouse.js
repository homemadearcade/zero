import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './RemoteMouse.scss';
import { noCobrowsingUpdateDelta } from '../../constants';
import { clearErrorState, changeErrorState } from '../../../store/actions/errorsActions';
import { COBROWSING_CONNECTION_LOST } from '../../../experience/constants';
import store from '../../../store';

const RemoteMouse = ({userId, errors: { errorStates }, status: { cobrowsingMouses}, changeErrorState, clearErrorState}) => {
  const mouseData = cobrowsingMouses[userId];
  const [lastPing, setLastPing] = useState()

  useEffect(() => {
    
    const mouseInterval = setInterval(() => {
      const mouseData = store.getState().status.cobrowsingMouses[userId];

      if(mouseData) {
        setLastPing(mouseData.lastPing)
        
        if(mouseData.lastPing + noCobrowsingUpdateDelta < Date.now()) {
          changeErrorState(COBROWSING_CONNECTION_LOST, { userId })
        } else if(errorStates[COBROWSING_CONNECTION_LOST].on) {
          clearErrorState(COBROWSING_CONNECTION_LOST)
        }
      } else if(lastPing) {
        if(lastPing + noCobrowsingUpdateDelta < Date.now()) {
          changeErrorState(COBROWSING_CONNECTION_LOST, { userId })
        }
      }
 
    }, 1000)

    return () => {
      clearInterval(mouseInterval)
    }
  }, [])

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
