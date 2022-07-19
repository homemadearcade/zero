import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import './GamesPage.scss';

import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';

import Layout from '../../layout/Layout';
import { getGames } from '../../store/actions/gameActions';
import Loader from '../../app/ui/Loader/Loader';
import { Link } from 'react-router-dom';
import GameForm from '../../app/GameForm/GameForm';
import { Typography } from '@mui/material';

const GamesPage = ({ getGames, game: { games, isLoading }}) => {
  useEffect(() => {
    getGames();
  }, []);

  return (
    <Layout>
      <div className="GamesPage">
        <Typography component="h1" variant="h1">Games page</Typography>
        <p>
          This is the Games page. Here are listed all of the games. Click the play link to play the game.
        </p>
        <div className="GamesPage__list">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {games.map((game, index) => {
                const { user } = game
                
                return (
                  <div key={index} className="GamesPage__game">
                      <div>
                        <span className="GamesPage__label">Created by: </span>
                        <span className="GamesPage__info">{user.username}</span>
                      </div>
                      <div>
                        <span className="GamesPage__label">Created by (email): </span>
                        <span className="GamesPage__info">{user.email}</span>
                      </div>
                      <div>
                        <span className="GamesPage__label">Created at: </span>
                        <span className="GamesPage__info">
                          {moment(game.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                        </span>
                      </div>
                      <Link to={`/play/${game.id}`} className="info bold profile-link">
                        Play!
                      </Link>
                  </div>
                );
              })}
               <GameForm onSubmit={() => {
                getGames()
              }}/>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default compose(
  requireAuth,
  requireAdmin,
  connect(mapStateToProps, { getGames }))(GamesPage);
