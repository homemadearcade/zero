import React, { useState, useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectGame.scss';

import { getArcadeGames } from '../../../store/actions/arcadeGameActions';
import Loader from '../../Loader/Loader';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';

const SelectGame = ({ onSelect, label, userId, getArcadeGames, gamesSelected, arcadeGames: { arcadeGames, isLoading }}) => {
  useEffect(() => {
    getArcadeGames();
  }, []);

  if(isLoading) return <Loader></Loader>

   const mapGameToOption = (game) => {
    const firstLetter = game.user ? game.user.username[0].toUpperCase() : 'fromprod'
    return {
      user: game.user,
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      label: game.metadata.title,
      value: game.id,
      isRemoved: game.isRemoved
    }
  }

  let options = arcadeGames.map(mapGameToOption).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))

  if(userId) {
    options = options.filter((option) => {
      if(option.user && option.user.id === userId) {
        return true
      }
    })
  }

  return (
    <div className="SelectGame">
      <SelectChipsAuto
        onChange={(event, games) => {
          onSelect(games)
        }}
        groupBy={(option) => option.firstLetter}
        hideRemoved
        formLabel={label ? label : "Games"}
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
  connect(mapStateToProps, { getArcadeGames }))(SelectGame);
