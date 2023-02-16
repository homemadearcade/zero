import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamesPage.scss';

import Layout from '../../layout/Layout';
import { getArcadeGames } from '../../store/actions/arcadeGameActions';
import GameForm from '../../app/arcadeGame/GameAddForm/GameAddForm';
import PageHeader from '../../ui/PageHeader/PageHeader';
import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';
import GameCopyForm from '../../app/arcadeGame/GameCopyForm/GameCopyForm';
import GameCard from '../../app/arcadeGame/GameCard/GameCard';
import GameList from '../../app/arcadeGame/GameList/GameList';
import Button from '../../ui/Button/Button';

const GamesPage = ({ getArcadeGames}) => {
  const [showRemovedGames, setShowRemovedGames] = useState()
  return (
    <Layout>
      <div className="GamesPage">
        <PageHeader 
          title="Games page"
          description="This is the Games page. Here are listed all of the games. Click the play link to play the game."
        ></PageHeader>
        <GameForm onSubmit={getArcadeGames}/>
        <GameCopyForm onSubmit={getArcadeGames}/>
        {!showRemovedGames &&  <Button onClick={() => {
          setShowRemovedGames(true)
        }}>Show Removed Games</Button>}
        <div className="GamesPage__list">
          <GameList>{(game) => {
            if(game.isRemoved && !showRemovedGames) return
            return <GameCard width={300} game={game} canPlay canEdit canPublish canRemove></GameCard>
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
