/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';

import './LobbySelectRoles.scss';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import Typography from '../../../ui/Typography/Typography';
import LobbyMember from '../LobbyMember/LobbyMember';
import Divider from '../../../ui/Divider/Divider';
import { RoleChip } from '../../../app/experienceModel/role/RoleChip/RoleChip';
import { isLobbyInstanceUserAlreadyAssignedRoles } from '../../../utils';

const LobbySelectRoles = ({
  editLobby,
  lobbyInstance: { lobbyInstance },
  myTracks, userTracks,
}) => {  
  const roles = lobbyInstance.roles
  const roleIdToUserMongoIds = lobbyInstance.roleIdToUserMongoIds

  return <>
    {Object.keys(roleIdToUserMongoIds).map((roleId) => {
      const userMongoIds = roleIdToUserMongoIds[roleId]
      const role = roles[roleId]
      return <div key={roleId}>
        <Divider></Divider>
        <RoleChip role={role}/>
        {userMongoIds.map((userMongoId, index) => {
          return <div key={userMongoId}>
            {'#' + (index + 1)}
            <LobbyMember key={userMongoId + roleId} myTracks={myTracks} userTracks={userTracks} userMongoId={userMongoId}></LobbyMember>
          </div>
        })}
        <SelectUsers key={roleId+'select'} usersSelected={userMongoIds} onSelect={(users) => {
          // if(users[0]) {
            if(isLobbyInstanceUserAlreadyAssignedRoles(lobbyInstance, roleId, users[users.length-1])) return alert('this user is already assigned a role')
            editLobby(lobbyInstance.id, {
              roleIdToUserMongoIds: {
                [roleId]: users
              }
            })
          // }
        }}/>
      </div>
    })}
  </>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbySelectRoles);
