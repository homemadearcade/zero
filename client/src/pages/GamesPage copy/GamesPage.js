import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamesPage.scss';

import Layout from '../../layout/Layout';
import { getArcadeGames } from '../../store/actions/arcadeGameActions';
import Loader from '../../ui/Loader/Loader';
import GameForm from '../../app/arcadeGame/GameAddForm/GameAddForm';
import { ADMIN_ROLE } from '../../game/constants';
import PageHeader from '../../ui/PageHeader/PageHeader';
import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';
import GameCopyForm from '../../app/arcadeGame/GameCopyForm/GameCopyForm';
import GameCard from '../../app/arcadeGame/GameCard/GameCard';
import GameList from '../../app/arcadeGame/GameList/GameList';

const GamesPage = ({ getArcadeGames, auth: { me }}) => {
  function getPublishData(game) {
    let visible = false 
    let publishable = false

    if(me?.role === ADMIN_ROLE || me?.id === game.user?.id) {
      visible = true 
      publishable = true
    } else if(game.metadata.isPublished) {
      visible = true 
    }

    return {
      visible,
      publishable
    }
  }

  return (
    <Layout>
      <div className="GamesPage">
        <PageHeader 
          title="Games page"
          description="This is the Games page. Here are listed all of the games. Click the play link to play the game."
        ></PageHeader>
        <GameForm onSubmit={getArcadeGames}/>
        <GameCopyForm onSubmit={getArcadeGames}/>
        <div className="GamesPage__list">
          <GameList>{(game) => {
            const { visible, publishable } = getPublishData(game)
            if(!visible) return
            return <GameCard game={game} canPlay canEdit canPublish={publishable}></GameCard>
          }}</GameList>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { getArcadeGames }))(GamesPage);
