/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SpeedTestTable from '../../../ui/SpeedTestTable/SpeedTestTable';
import Typography from '../../../ui/Typography/Typography';
import UserSpeedTestButton from '../UserSpeedTestButton/UserSpeedTestButton';
import './UserSpeedTestList.scss'
import { reverse } from 'lodash';

const UserSpeedTestList = ({
  user,
}) => {
    return <div className="UserSpeedTestList">
      <Typography component="h5" variant="h5">Device Speed Tests</Typography>
      {user.speedTests?.length > 0 && <SpeedTestTable rows={reverse(user.speedTests)}></SpeedTestTable>}
      <UserSpeedTestButton></UserSpeedTestButton>
    </div>
};

const mapStateToProps = (state) => ({
});

export default compose(
  connect(mapStateToProps, { }),
)(UserSpeedTestList);
