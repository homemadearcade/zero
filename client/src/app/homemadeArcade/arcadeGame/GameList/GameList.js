import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameList.scss';

import { TextField } from '@mui/material';
import Link from '../../../../ui/Link/Link';
import Loader from '../../../../ui/Loader/Loader';
import { getArcadeGames } from '../../../../store/actions/arcadeGameActions';
import GameCard from '../GameCard/GameCard';

const GameList = ({ getArcadeGames, children, arcadeGames: { arcadeGames, isLoading }}) => {
  useEffect(() => {
    getArcadeGames();
  }, [getArcadeGames]);

  const [searchTerm, setSearchTerm] = useState("")
  const [gamesList, setGamesList] = useState(arcadeGames)

  useEffect(() => {
    if(searchTerm) {
      setGamesList(arcadeGames.filter((game) => {
        if(game.metadata.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.user?.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.metadata.description?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.metadata.authorPseudonym?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        return false
      }))
    } else {
      setGamesList(arcadeGames)
    }
  }, [searchTerm, arcadeGames])

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="GameList">
      <TextField onChange={handleSearchChange} value={searchTerm} label={"Search"} />
      {isLoading ? (
        <Loader />
      ) : <div className="GameList__list">{gamesList.map(children)}</div>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  arcadeGames: state.arcadeGames,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getArcadeGames })
)(GameList);
