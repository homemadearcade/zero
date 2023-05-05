import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectArcadeGame.scss';

import { getArcadeGames } from '../../../store/actions/game/arcadeGameActions';
import Loader from '../../Loader/Loader';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';

const SelectArcadeGame = ({ excludedIds, removeFilter, onSelect, label, userMongoId, getArcadeGames, gamesSelected = [], arcadeGames: { arcadeGames, isLoading }}) => {
  useEffect(() => {
    getArcadeGames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(isLoading) return <Loader></Loader>

  if(!arcadeGames.length) return <div>No Games</div>;

   const mapGameToOption = (game) => {
    const firstLetter = game.owner ? game.owner.username[0].toUpperCase() : 'fromprod'
    let isRemoved = game.isRemoved
    if(removeFilter && !isRemoved) {
      isRemoved = removeFilter(game)
    }

    return {
      owner: game.owner,
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      title: game.metadata.title,
      value: game.id,
      isRemoved
    }
  }

  let options = arcadeGames.map(mapGameToOption).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))

  if(userMongoId) {
    options = options.filter((option) => {
      if(excludedIds && excludedIds.indexOf(option.value) === 0) {
        return false
      }

      if(option.owner && option.owner.id === userMongoId) {
        return true
      } else if(gamesSelected.indexOf(option.value) >= 0) {
        return true
      }
      return false
    })
  }
  
  return (
    <div className="SelectArcadeGame">
      <SelectChipsAuto
        onChange={(event, arcadeGameMongoIds) => {
          const games = arcadeGames.filter((game) => arcadeGameMongoIds.indexOf(game.id) >= 0)
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
