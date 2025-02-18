/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getUserByUsername } from '../../store/actions/user/userActions';

import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import Typography from '../../ui/Typography/Typography';
import PageHeader from '../../ui/PageHeader/PageHeader';
import GameList from '../../app/gameModel/GameList/GameList';
import GameCard from '../../app/gameModel/GameCard/GameCard';
import UserSpeedTestList from '../../app/user/UserSpeedTestList/UserSpeedTestList';
import UserInfo from '../../app/user/UserInfo/UserInfo';
import UserInterfaceIds from '../../app/user/UserInterfaceIds/UserInterfaceIds';
import Tabs from '../../ui/Tabs/Tabs';
import { USER_EXPERIENCES_TAB_IID, USER_GAMES_TAB_IID, USER_INFO_TAB_IID, USER_INTERFACE_IDS_TAB_IID, USER_ROLES_TAB_IID, USER_SPEED_TESTS_TAB_IID } from '../../constants/interfaceIds';
import Button from '../../ui/Button/Button';
import UserRoles from '../../app/user/UserRoles/UserRoles';
import ExperienceList from '../../app/experienceModel/experience/ExperienceList/ExperienceList';
import ExperienceCard from '../../app/experienceModel/experience/ExperienceCard/ExperienceCard';

const UserPage = ({
  getUserByUsername,
  user: { user, isLoading },
  history,
  match,
}) => {

  const matchUsername = match.params.username;

  useEffect(() => {
    getUserByUsername(matchUsername, history);
  }, [matchUsername]);

  return (
    <Layout>
      <div className="UserPage">
        <PageHeader
          title={user.username + "'s account"}
          description="This is all your account information. You can edit your account here"
        ></PageHeader>
        {isLoading ? (
          <Loader text="Loading User..."/>
        ) : (
          <Tabs tabs={[
            {
              interfaceId: USER_INFO_TAB_IID,
              label: 'Info',
              body: <UserInfo/>
            },
            {
              interfaceId: USER_INTERFACE_IDS_TAB_IID,
              appAdminOnly: true,
              label: 'Interface Ids',
              body: <UserInterfaceIds/>
            },
            { 
              interfaceId: USER_ROLES_TAB_IID,
              appAdminOnly: true,
              label: 'Roles',
              body: <UserRoles/>
            },
            {
              interfaceId: USER_SPEED_TESTS_TAB_IID,
              label: 'Speed Tests',
              body: <UserSpeedTestList user={user}></UserSpeedTestList>
            },
            {
              appAdminOnly: true,
              label: 'App Location',
              body: <>
                <Typography variant="body1">{user.appLocation && JSON.stringify(user.appLocation)}</Typography>
              </>
            }
          ]}></Tabs>
        )}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getUserByUsername }),
)(UserPage);
