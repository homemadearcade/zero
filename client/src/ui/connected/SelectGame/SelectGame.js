import React, { useState, useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectGame.scss';

import { getArcadeGames } from '../../../store/actions/arcadeGameActions';
import Loader from '../../Loader/Loader';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SelectGame = ({ onSelect, userId, getArcadeGames, arcadeGames: { arcadeGames, isLoading }}) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    getArcadeGames();
  }, []);

  function sortByFirstName(option) {
    // const firstLetter = option.metadata.title[0].toUpperCase();
    const firstLetter = option.user ? option.user.username[0].toUpperCase() : 'fromprod'

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  }

  useEffect(() => {

    if(userId) {
      const options = arcadeGames.filter((option) => {
        if(option.user?.id === userId) return true 
        return false
      }).map(sortByFirstName)

      setOptions(options) 
      return
    }

    const options = arcadeGames.map(sortByFirstName);

    setOptions(options) 
  }, [arcadeGames])

  return (
    <div className="SelectGame">
      <div className="SelectGame__list">
        {isLoading ? (
          <Loader />
        ) : (options && <Autocomplete
              id="grouped-demo"
              options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
              groupBy={(option) => option.firstLetter}
              getOptionLabel={(option) => option.metadata.title ? option.metadata.title : option.user.username + '-' + option.id}
              onChange={(e, value) => {
                onSelect(value)
              }}
              renderInput={(params) => <TextField {...params} label="Games by authors username" />}
            />)
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  arcadeGames: state.arcadeGames,
});

export default compose(
  connect(mapStateToProps, { getArcadeGames }))(SelectGame);
