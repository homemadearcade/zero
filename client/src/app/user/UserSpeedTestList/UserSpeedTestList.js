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
  auth: { me }
}) => {
    return <>
      <div className="UserSpeedTestList">
        {user.speedTests?.length > 0 && <SpeedTestTable rows={reverse(user.speedTests)}></SpeedTestTable>}
      </div>
      {me.id === user.id && <UserSpeedTestButton></UserSpeedTestButton>}
    </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { }),
)(UserSpeedTestList);
