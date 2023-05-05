import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectUsers.scss';

import { getUsers } from '../../../store/actions/user/usersActions';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import Loader from '../../Loader/Loader';

const SelectUsers = ({ userMongoIds, label, onSelect, groupBy, usersSelected = [], getUsers, users: { users, isLoading }}) => {
  useEffect(() => {
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(isLoading || !users.length) {
    return <Loader text="Users Loading..."/>
  }

  const mapUserToOption = (user) => {
    return {
      title: user.username + ', ' + user.email,
      value: user.id,
      isRemoved: user.isRemoved
    }
  }

  let options = users.map(mapUserToOption)

  if(userMongoIds) {
    options = options.filter(({value}) => {
      if(userMongoIds.indexOf(value) >= 0) return true
      return false
    })
  }

  return (
    <div className="SelectUsers">
      <SelectChipsAuto
        onChange={(event, usersSelected) => {
          onSelect(usersSelected)
        }}
        groupBy={groupBy}
        hideRemoved
        formLabel={label}
        value={usersSelected}
        options={options}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default compose(
  connect(mapStateToProps, { getUsers }))(SelectUsers);
