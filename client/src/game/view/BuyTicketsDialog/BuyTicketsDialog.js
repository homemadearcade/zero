import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import './BuyTicketsDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { useTimer } from 'react-timer-hook';
import { APP_ADMIN_ROLE } from '../../../constants';
import { closeBuyTicketsDialog } from '../../../store/actions/game/gameSelectorActions';

const playTime = 100

const BuyTicketsDialog = ({ 
  auth: { me },
  closeBuyTicketsDialog
}) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + playTime);
  const [expiryTimestamp, setExpiryTimestamp] = React.useState(time);

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
  } = useTimer({ expiryTimestamp, autoStart: true, onExpire: () => {
      if(!me.roles[APP_ADMIN_ROLE]) {
        window.location.reload()
      }
  }});

  function renderTimer() {
    return <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '2em'}}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  }

    return <CobrowsingDialog widthModifier={1.2} open onClose={closeBuyTicketsDialog}>
      <div className='BuyTickets__content'>

      <Typography variant="subtitle1">
        It seems like you’re beginning to get it
        <br/><br/>
        Let me tell you more.
        <br/><br/>
        Lets meet another time
        <br/><br/>
	      Ill see you soon
      </Typography>

      <Typography variant="h5" font="2P">
        Homemade Arcade
      </Typography>

      <img 
        src="/assets/images/haqr.png" 
        alt="yo" 
        style={{width: '200px', background: 'white'}}
      />
      </div>
      {renderTimer()}
    </CobrowsingDialog>
 }

const mapStateToProps = (state) => mapCobrowsingState(state, {
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { closeBuyTicketsDialog }),
)(BuyTicketsDialog)