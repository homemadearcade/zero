import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import GameCard from '../GameCard/GameCard';
import { getArcadeGame } from '../../../store/actions/game/arcadeGameActions';
import Loader from '../../../ui/Loader/Loader';


const GameCardLoad = (props) => {
  const [game, setGame] = useState(null)

  useEffect(() => {
    async function goGetArcadeGame() {
      const arcadeGame = await props.getArcadeGame(props.gameId)
      setGame(arcadeGame)
    }

    goGetArcadeGame()
  }, [props.gameId])

  if(!game) return <Loader/>

  return <GameCard {...props} game={game}/>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { getArcadeGame }))(GameCardLoad);
