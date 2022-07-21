import React, { useState, useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameSelect.scss';

import { getGames } from '../../store/actions/gameActions';
import Loader from '../ui/Loader/Loader';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const GameSelect = ({ onSelect, getGames, game: { games, isLoading }}) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    const options = games.map((option) => {
      // const firstLetter = option.metadata.title[0].toUpperCase();
      const firstLetter = option.user.username[0].toUpperCase();

      return {
        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
        ...option,
      };
    });

    setOptions(options) 
  }, [games])

  return (
    <div className="GameSelect">
      <div className="GameSelect__list">
        {isLoading ? (
          <Loader />
        ) : (options && <Autocomplete
              id="grouped-demo"
              options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
              groupBy={(option) => option.firstLetter}
              getOptionLabel={(option) => option.user.username + '-' + option.id}
              onChange={(e) => {
                onSelect(games[e.target.value])
              }}
              renderInput={(params) => <TextField {...params} label="Games by authors username" />}
            />)
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default compose(
  connect(mapStateToProps, { getGames }))(GameSelect);
