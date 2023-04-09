/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';

import './LobbySelectRoles.scss';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import Typography from '../../../ui/Typography/Typography';
import LobbyUsername from '../LobbyMember/LobbyMember';
import Divider from '../../../ui/Divider/Divider';
import { RoleChip } from '../../../app/experienceModel/role/RoleChip/RoleChip';

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
      return <>
        <Divider></Divider>
        <RoleChip role={role}/>
        {userMongoIds.map((userMongoId, index) => {
          return <>
            {'#' + index + 1}
            <LobbyUsername myTracks={myTracks} userTracks={userTracks} userMongoId={userMongoId}></LobbyUsername>
          </>
        })}
        <SelectUsers usersSelected={userMongoIds} onSelect={(users) => {
          if(users[0]) {
            editLobby(lobbyInstance.id, {
              roleIdToUserMongoIds: {
                [roleId]: users
              }
            })
          }
        }}/>
      </>
    })}
    
  </>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbySelectRoles);
