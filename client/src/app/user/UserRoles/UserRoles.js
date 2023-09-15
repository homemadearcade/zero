/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { editUserRoles } from '../../../store/actions/user/userActions';

import requireAuth from '../../../hoc/requireAuth';


import './UserRoles.scss'
import Checkbox from '../../../ui/Checkbox/Checkbox';
import { userRoleInterfaceData } from '../../../constants';
import Typography from '../../../ui/Typography/Typography';
import Divider from '../../../ui/Divider/Divider';

const UserRoles = ({
  user: { user },
  editUserRoles,
}) => {
  return (
    <div className='UserRoles'>
      {Object.keys(userRoleInterfaceData).map((userRoleId) => {
        const { name, description } = userRoleInterfaceData[userRoleId]
        return <div>
          <Checkbox size="small" checked={user.roles[userRoleId]} onChange={(checked) => {
            editUserRoles(user.id, { roles: {
              [userRoleId]: checked
            }})
          }} label={name}></Checkbox>
          <Typography className="description" variant="subtitle2">{description}</Typography>
          <Divider/>
        </div>
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { editUserRoles }),
)(UserRoles);
