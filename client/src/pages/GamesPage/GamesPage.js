import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamesPage.scss';

import Layout from '../../layout/Layout';
import { getArcadeGames } from '../../store/actions/arcadeGameActions';
import GameForm from '../../app/homemadeArcade/arcadeGame/GameAddForm/GameAddForm';
import PageHeader from '../../ui/PageHeader/PageHeader';
import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';
import GameCopyForm from '../../app/homemadeArcade/arcadeGame/GameCopyForm/GameCopyForm';
import GameCard from '../../app/homemadeArcade/arcadeGame/GameCard/GameCard';
import GameList from '../../app/homemadeArcade/arcadeGame/GameList/GameList';

const GamesPage = ({ getArcadeGames, auth: { me }}) => {
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
            if(game.isRemoved) return
            return <GameCard width={300} game={game} canPlay canEdit canPublish canRemove></GameCard>
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
  requireAdmin,
  connect(mapStateToProps, { getArcadeGames }))(GamesPage);
