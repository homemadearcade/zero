import React, { useState, useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectArcadeGame.scss';

import { getArcadeGames } from '../../../store/actions/arcadeGameActions';
import Loader from '../../Loader/Loader';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';

const SelectArcadeGame = ({ onSelect, label, userId, getArcadeGames, gamesSelected = [], arcadeGames: { arcadeGames, isLoading }}) => {
  useEffect(() => {
    getArcadeGames();
  }, []);

  if(isLoading) return <Loader></Loader>

  if(!arcadeGames.length) return <div>No Games</div>;

   const mapGameToOption = (game) => {
    const firstLetter = game.owner ? game.owner.username[0].toUpperCase() : 'fromprod'
    return {
      owner: game.owner,
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      label: game.metadata.title,
      value: game.id,
      isRemoved: game.isRemoved
    }
  }

  let options = arcadeGames.map(mapGameToOption).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))

  if(userId) {
    options = options.filter((option) => {
      if(option.owner && option.owner.id === userId) {
        return true
      } else if(gamesSelected.indexOf(option.value) >= 0) {
        return true
      }
    })
  }
  
  return (
    <div className="SelectArcadeGame">
      <SelectChipsAuto
        onChange={(event, games) => {
          onSelect(games)
        }}
        groupBy={(option) => option.firstLetter}
        hideRemoved
        formLabel={label ? label : "Games by Owner name"}
        value={gamesSelected}
        options={options}
      />
    </div>
  );

};

const mapStateToProps = (state) => ({
  arcadeGames: state.arcadeGames,
});

export default compose(
  connect(mapStateToProps, { getArcadeGames }))(SelectArcadeGame);
