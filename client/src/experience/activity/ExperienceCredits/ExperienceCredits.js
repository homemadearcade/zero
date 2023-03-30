/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import Typography from '../../../ui/Typography/Typography';
import './ExperienceCredits.scss'
import ConstellationHero from '../../../marketing/homemadeArcade/ConstellationHero/ConstellationHero';
import Link from '../../../ui/Link/Link';
import GameCardLoad from '../../../app/gameModel/GameCardLoad/GameCardLoad';
import useGameEditorSize from '../../../hooks/useGameEditorSize';

const ExperienceCredits = ({
  lobbyInstance: { lobbyInstance: { editingGameId }},
}) => {
  const { gameEditorWidth, gameEditorHeight } = useGameEditorSize()

  if(!gameEditorHeight || !gameEditorWidth) return 

  return <div className="ExperienceCredits"><ConstellationHero width={gameEditorWidth} height={gameEditorHeight}>
      <br></br>
      <br></br>
      <Typography variant="h5">By Spencer Williams and Jonathan Pedigo</Typography>
      <br></br>
      <br></br>
      <Typography variant="h5">
        A collaboration between<br></br>
        <Link href="https://towalkthenight.com" newTab>
          To Walk The Night
        </Link> 
        <br></br>
        and<br></br>
        <Link href={`${window.location.origin}/wishlabs`} newTab>
          Wish Labs
        </Link>
      </Typography>
    </ConstellationHero>
    <GameCardLoad canPlay arcadeGameMongoId={editingGameId}/>
    <Link newTab href={`${window.location.origin}/arcade`}>Browse Other Games To Play</Link>
  </div>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(ExperienceCredits);
