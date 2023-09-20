import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './UserList.scss';

import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Loader from '../../../ui/Loader/Loader';
import Button from '../../../ui/Button/Button';
import Checkbox from '../../../ui/Checkbox/Checkbox';
import ButtonGroup from '../../../ui/ButtonGroup/ButtonGroup';
import { APP_ADMIN_ROLE } from '../../../constants';
import { getUsers } from '../../../store/actions/user/usersActions';

const SORT_CREATED = 'SORT_CREATED'
const SORT_EDITED = 'SORT_EDITED'

const UserList = ({ getUsers, hideSearch,  children, users: { users, isLoading }}) => {
  useEffect(() => {
    getUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState("")
  const [usersList, setGamesList] = useState(users)
  const [showRemoved, setShowRemoved] = useState(false)
  const [showAppAdmin, setShowAppAdmin] = useState(false)
  const [sortBy, setSortBy] = useState(SORT_CREATED)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
            // if((user.isRemoved && !showRemovedGames)) return 
            // if((user.playScope === PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE)) return

  useEffect(() => {
    if(searchTerm) {
      setGamesList(users.filter((user) => {
        if(user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        return false
      })).slice().sort(sortUserList)
    } else {
      setGamesList(users.slice().sort(sortUserList))
    }
  }, [searchTerm, users, sortBy])

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  function sortUserList(userA, userB) {
    if(sortBy === SORT_CREATED) {
      return new Date(userB.createdAt).getTime() - new Date(userA.createdAt).getTime()
    } else if(sortBy === SORT_EDITED) {
      return new Date(userB.updatedAt).getTime() - new Date(userA.updatedAt).getTime()
    }
  }

  function filterUserList(user) {
    if(showRemoved || showAppAdmin) {
      if((user.isRemoved && showRemoved)) return true
      if((user.roles[APP_ADMIN_ROLE] && showAppAdmin)) return true
      return false
    }

    if((user.isRemoved)) return false

    return true
  }

  function renderUserList() {
    // if(customFilter) {
    //   return usersList.filter(customFilter).filter(filterUserList).map(children)
    // } else {
      return usersList.filter(filterUserList).map(children)
    // }
  }

  function renderToggles() {
    return <div className="UserList__filter">
      Filter By:

      <div>
        <Checkbox size="small" checked={showAppAdmin} onChange={(checked) => {
          setShowAppAdmin(checked)
      }} label={<>
        App Admins
      </>}></Checkbox>
        <Checkbox size="small" checked={showRemoved} onChange={(checked) => {
          setShowRemoved(checked)
        }} label={"Removed"}></Checkbox>

      </div>
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

  return <>
    <div className="UserList">
      <div className="UserList__search">
      {!hideSearch && <TextField sx={{width: '100%'}} 
        onChange={handleSearchChange} 
        value={searchTerm} 
        label={"Search Email, Username"}
        InputProps={{
        endAdornment: (
          <InputAdornment>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
          )
        }}  
      />}
      {showAdvancedSearch&& renderSortBy()}
      {showAdvancedSearch&& renderToggles()}
      </div>
      { !hideSearch && !showAdvancedSearch && <Button size="small" onClick={() => {
        setShowAdvancedSearch(true)
      }}>
        Advanced Search
      </Button>}
      {isLoading ? (
        <Loader />
      ) : <div className="UserList__list">{renderUserList()}</div>}
    </div>

    </>
};

const mapStateToProps = (state) => ({
  users: state.users,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getUsers })
)(UserList);
