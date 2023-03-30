/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { addUserSpeedTest } from '../../../store/actions/user/userActions';
import SpeedTestTable from '../../../ui/SpeedTestTable/SpeedTestTable';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import UserSpeedTestButton from '../UserSpeedTestButton/UserSpeedTestButton';
import { isSpeedTestPassing } from '../../../utils/networkUtils';

const UserSpeedTestRequest = ({
  addUserSpeedTest,
  isOptional,
  children,
  onContinue = () => {}
}) => {
    const [speedTest, setSpeedTest] = useState()
    const [didPass, setDidPass] = useState(null)
    const [isContinuingOn, setIsContinuingOn] = useState(null)

    function renderBody() {
      if(children && isContinuingOn) {
        return children
      }

      if(didPass === true) {
        return <>
          {speedTest && <SpeedTestTable rows={[speedTest]}></SpeedTestTable>}
          <Typography component="h5" variant="h5">Congrats! Your internet speed passed the test</Typography>
          <Button onClick={() => {
            setIsContinuingOn(true)
            onContinue()
          }}>Continue</Button>
        </>
      }

      if(didPass === false) {
        return <>
          {speedTest && <SpeedTestTable rows={[speedTest]}></SpeedTestTable>}
          <Typography component="h5" variant="h5">Unfortunately your internet speed did not pass the test, try again on another connection.</Typography>
          {isOptional && <Button onClick={() => {
            setIsContinuingOn(true)
            onContinue()
          }}>Continue</Button>}
        </>
      }

      return <>
        <Typography component="h5" variant="h5">Please test your internet speed before continuing</Typography>
        <UserSpeedTestButton onSpeedTestComplete={(speedTest) => {
          
          setSpeedTest(speedTest)

          if(isSpeedTestPassing(speedTest)) {
            setDidPass(true)
          } else {
            setDidPass(false)
          }


        }}/>
        {speedTest && <SpeedTestTable rows={[speedTest]}></SpeedTestTable>}
        {isOptional && <Button onClick={() => {
            setIsContinuingOn(true)
            onContinue()
        }}>Not now</Button>}
      </>
    }

    return <div className="UserSpeedTest">
      {renderBody()}
    </div>
};

const mapStateToProps = (state) => ({
});

export default compose(
  connect(mapStateToProps, { addUserSpeedTest }),
)(UserSpeedTestRequest);
