import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import KeyIndicator from '../../ui/KeyIndicator/KeyIndicator';
import './BuyTickets.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeBuyTicketsDialog, openBuyTicketsDialog } from '../../../store/actions/game/gameSelectorActions';
import { initialStageId } from '../../constants';
import { useTimer } from 'react-timer-hook';
import { APP_ADMIN_ROLE } from '../../../constants';
import { rest } from 'lodash';
import BuyTicketsDialog from '../BuyTicketsDialog/BuyTicketsDialog';

const playTime = 300

const BuyTickets = ({ 
  gameModel: { currentStageId }, 
  gameSelector: { isBuyTicketsDialogOpen }, 
  closeBuyTicketsDialog, 
  openBuyTicketsDialog,
  auth: { me }
 }) => {
  const [expiryTimestamp, setExpiryTimestamp] = React.useState();

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => {
    if(!me.roles[APP_ADMIN_ROLE]) {
      openBuyTicketsDialog()
    }
  }});

  useEffect(() => {
    if(currentStageId === initialStageId) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + playTime);
      restart(time)
    }

  }, [currentStageId])

  function renderTimer() {
    if(minutes == 0 && seconds == 0) return 
    return <div style={{textAlign: 'center'}}>
      {!me.roles[APP_ADMIN_ROLE] && <div style={{fontSize: '2em'}}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>}
      {me.roles[APP_ADMIN_ROLE] && <>
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={resume}>Resume</button>
        <button onClick={() => {
          // Restarts to 5 minutes timer
          const time = new Date();
          time.setSeconds(time.getSeconds() + playTime);
          restart(time)
        }}>Restart</button>
      </>}
    </div>
  }

  return <div className="BuyTickets" onClick={openBuyTicketsDialog}>
    {isRunning && renderTimer()}
    {isBuyTicketsDialogOpen && <BuyTicketsDialog />}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameModel: state.gameModel,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { closeBuyTicketsDialog, openBuyTicketsDialog }),
)(BuyTickets)