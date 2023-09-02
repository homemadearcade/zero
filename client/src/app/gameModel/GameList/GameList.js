import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameList.scss';

import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Loader from '../../../ui/Loader/Loader';
import { getArcadeGames } from '../../../store/actions/game/arcadeGameActions';
import Button from '../../../ui/Button/Button';
import Checkbox from '../../../ui/Checkbox/Checkbox';
import { PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE } from '../../../game/constants';
import ButtonGroup from '../../../ui/ButtonGroup/ButtonGroup';

const SORT_CREATED = 'SORT_CREATED'
const SORT_EDITED = 'SORT_EDITED'

const GameList = ({ customFilter, getArcadeGames, children, arcadeGames: { arcadeGames, isLoading }}) => {
  useEffect(() => {
    getArcadeGames();
  }, [getArcadeGames]);

  const [searchTerm, setSearchTerm] = useState("")
  const [gamesList, setGamesList] = useState(arcadeGames)
  const [showRemoved, setShowRemoved] = useState(false)
  const [showTemporary, setShowTemporary] = useState(false)
  const [sortBy, setSortBy] = useState(SORT_CREATED)
            // if((game.isRemoved && !showRemovedGames)) return 
            // if((game.playScope === PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE)) return

  useEffect(() => {
    if(searchTerm) {
      setGamesList(arcadeGames.filter((game) => {
        if(game.metadata.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.owner?.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.metadata.description?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.metadata.authorPseudonym?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        return false
      })).slice().sort(sortGameList)
    } else {
      setGamesList(arcadeGames.slice().sort(sortGameList))
    }
  }, [searchTerm, arcadeGames, sortBy])

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  function sortGameList(gameA, gameB) {
    if(sortBy === SORT_CREATED) {
      return new Date(gameB.createdAt).getTime() - new Date(gameA.createdAt).getTime()
    } else if(sortBy === SORT_EDITED) {
      return new Date(gameB.updatedAt).getTime() - new Date(gameA.updatedAt).getTime()
    }
  }

  function filterGameList(game) {
    if((game.isRemoved && !showRemoved)) return false 
    if((game.playScope === PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE && !showTemporary)) return

    return true
  }

  function renderGameList() {
    if(customFilter) {
      gamesList.filter(customFilter).filter(filterGameList).map(children)
    } else {
      return gamesList.filter(filterGameList).map(children)
    }
  }

  function renderToggles() {
    return <div>
      Show:<br/>
      <Checkbox size="small" checked={showTemporary} onChange={(checked) => {
        setShowTemporary(checked)
    }} label={<>
      Temporary Games
    </>}></Checkbox>
      <Checkbox size="small" checked={showRemoved} onChange={(checked) => {
        setShowRemoved(checked)
      }} label={"Removed Games"}></Checkbox>
    </div>
  }

  function renderSortBy() {
    return <>
      <ButtonGroup value={sortBy} onSelectOption={(e) => {
        setSortBy(e.target.value)
      }} formLabel="Sort By:" options={[{icon: 'Created', value: SORT_CREATED}, {value: SORT_EDITED, icon: 'Last Edit'}]}>
      </ButtonGroup>
    </>
  }



  return (
    <div className="GameList">
      <TextField sx={{width: '100%'}} 
        onChange={handleSearchChange} 
        value={searchTerm} 
        label={"Search Title, Author, Description"}
        InputProps={{
        endAdornment: (
          <InputAdornment>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
          )
        }}  
      />
      {!customFilter && renderSortBy()}
      {!customFilter && renderToggles()}
      {isLoading ? (
        <Loader />
      ) : <div className="GameList__list">{renderGameList()}</div>}
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
