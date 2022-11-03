import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectUser.scss';

import { getUsers } from '../../../store/actions/usersActions';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import Loader from '../../Loader/Loader';

const SelectUser = ({ onSelect, usersSelected, getUsers, users: { users, isLoading }}) => {
  useEffect(() => {
    getUsers();
  }, []);

  if(isLoading || !users.length) {
    return <Loader text="Users Loading..."/>
  }

  const mapUserToOption = (user) => {
    return {
      label: user.username + ', ' + user.email,
      value: user.id
    }
  }

  const options = users.map(mapUserToOption)

  return (
    <div className="SelectUser">
      <SelectChipsAuto
        onChange={(event, usersSelected) => {
          onSelect(usersSelected)
        }}
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
  connect(mapStateToProps, { getUsers }))(SelectUser);
