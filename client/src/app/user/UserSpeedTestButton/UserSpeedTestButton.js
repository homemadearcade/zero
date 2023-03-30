/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from '../../../ui/Button/Button';
import { addUserSpeedTest } from '../../../store/actions/user/userActions';
import Icon from '../../../ui/Icon/Icon';

const UserSpeedTestButton = ({
  user: { isTestingInternetSpeed },
  onSpeedTestComplete = () => {},
  addUserSpeedTest
}) => {
    return <Button disabled={isTestingInternetSpeed} onClick={async () => {
       const speedTest = await addUserSpeedTest()
       onSpeedTestComplete(speedTest)
    }}>
      {isTestingInternetSpeed && 'Testing...' }
      {!isTestingInternetSpeed && <>
      <Icon icon="faPlus"></Icon>
      Test Internet Speed
      </>}
    </Button>
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default compose(
  connect(mapStateToProps, { addUserSpeedTest }),
)(UserSpeedTestButton);
