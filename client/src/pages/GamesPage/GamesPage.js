import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamesPage.scss';

import Layout from '../../layout/Layout';
import { getArcadeGames } from '../../store/actions/game/arcadeGameActions';
import GameForm from '../../app/gameModel/GameAddForm/GameAddForm';
import PageHeader from '../../ui/PageHeader/PageHeader';
import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';
import GameCopyForm from '../../app/gameModel/GameCopyForm/GameCopyForm';
import GameCard from '../../app/gameModel/GameCard/GameCard';
import GameList from '../../app/gameModel/GameList/GameList';
import Button from '../../ui/Button/Button';
import Divider from '../../ui/Divider/Divider';

const GamesPage = ({ getArcadeGames}) => {  
  return (
    <Layout>
      <div className="GamesPage">
        <PageHeader 
          title="Games page"
          description="This is the Games page. Here are listed all of the games. Click the play link to play the game."
        ></PageHeader>
        <GameForm onSubmit={getArcadeGames}/>
        {/* <GameCopyForm onSubmit={getArcadeGames}/> */}
        <div className="GamesPage__list">
          <GameList>{(game, index) => {
            return <GameCard key={game.id} width={300} game={game} canPlay canEdit canPublish canRemove></GameCard>
          }}</GameList>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireAuth,
  requireAdmin,
  connect(mapStateToProps, { getArcadeGames }))(GamesPage);
