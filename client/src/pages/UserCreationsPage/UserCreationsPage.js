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
import Tabs from '../../ui/Tabs/Tabs';
import { USER_EXPERIENCES_TAB_IID, USER_GAMES_TAB_IID, USER_INFO_TAB_IID, USER_INTERFACE_IDS_TAB_IID, USER_ROLES_TAB_IID, USER_SPEED_TESTS_TAB_IID } from '../../constants/interfaceIds';
import ExperienceList from '../../app/experienceModel/experience/ExperienceList/ExperienceList';
import ExperienceCard from '../../app/experienceModel/experience/ExperienceCard/ExperienceCard';

const UserCreationsPage = ({
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
      <div className="UserCreationsPage">
        <PageHeader
          title={user.username + "'s creations"}
          description="This is all your creations."
        ></PageHeader>
        {isLoading ? (
          <Loader text="Loading User..."/>
        ) : (
          <Tabs tabs={[
            {
              interfaceId: USER_GAMES_TAB_IID,
              label: 'Games',
              body: <>
                <GameList>
                  {(game) => {
                    if(game.owner?.id !== user.id) return null
                    return <GameCard key={game.id} game={game} canPlay canEdit></GameCard>
                  }}
                </GameList>
              </>
            },
            {
              interfaceId: USER_EXPERIENCES_TAB_IID,
              label: 'Experiences',
              body: <>
                <ExperienceList>{(experienceModel) => {
                  if(experienceModel.owner?.id !== user.id) return null
                  return <ExperienceCard key={experienceModel.id} width={300} experienceModel={experienceModel} canPlay canEdit canPublish canRemove></ExperienceCard>
                }}</ExperienceList>   
              </>               
            },
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
)(UserCreationsPage);
