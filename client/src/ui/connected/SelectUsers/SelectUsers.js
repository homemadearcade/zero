import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectUsers.scss';

import { getUsers } from '../../../store/actions/usersActions';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import Loader from '../../Loader/Loader';

const SelectUsers = ({ onSelect, usersSelected, getUsers, users: { users, isLoading }}) => {
  useEffect(() => {
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(isLoading || !users.length) {
    return <Loader text="Users Loading..."/>
  }

  const mapUserToOption = (user) => {
    return {
      label: user.username + ', ' + user.email,
      value: user.id,
      isRemoved: user.isRemoved
    }
  }

  const options = users.map(mapUserToOption)

  return (
    <div className="SelectUsers">
      <SelectChipsAuto
        onChange={(event, usersSelected) => {
          onSelect(usersSelected)
        }}
        hideRemoved
        formLabel="Users"
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
