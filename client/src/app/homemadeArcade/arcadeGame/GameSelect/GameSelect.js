import React, { useState, useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameSelect.scss';

import { getArcadeGames } from '../../../../store/actions/arcadeGameActions';
import Loader from '../../../../ui/Loader/Loader';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const GameSelect = ({ onSelect, getArcadeGames, arcadeGames: { arcadeGames, isLoading }}) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    getArcadeGames();
  }, []);

  useEffect(() => {
    const options = arcadeGames.map((option) => {
      // const firstLetter = option.metadata.title[0].toUpperCase();
      const firstLetter = option.user ? option.user.username[0].toUpperCase() : 'fromprod'

      return {
        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
        ...option,
      };
    });

    setOptions(options) 
  }, [arcadeGames])

  return (
    <div className="GameSelect">
      <div className="GameSelect__list">
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
  connect(mapStateToProps, { getArcadeGames }))(GameSelect);
