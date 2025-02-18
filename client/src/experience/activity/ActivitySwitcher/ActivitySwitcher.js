/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ActivitySwitcher.scss';
import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';
import Button from '../../../ui/Button/Button';
import SelectActivity from '../../../ui/connected/SelectActivity/SelectActivity';
import SelectViewCategory from '../../../ui/SelectViewCategory/SelectViewCategory';

const ActivitySwitcher = ({
  lobbyInstance: { lobbyInstance },
  editLobby,
}) => {
  const activity = lobbyInstance.activitys[lobbyInstance.currentActivityId]

  return (
    <div className="ActivitySwitcher">
      <div className="ActivitySwitcher__state">
        <SelectActivity
          activitys={lobbyInstance.activitys}
          formLabel={"Current Activity"}
          value={[lobbyInstance.currentActivityId]}
          onChange={(event, activityId) => {
            editLobby(lobbyInstance.id, {
              currentActivityId: activityId
            })       
          }}/>
      </div>
      <div className="ActivitySwitcher__state">
      <SelectViewCategory
        formLabel={activity.name + " View"}
        activityCategory={activity.activityCategory}
        onChange={(e) => {
          editLobby(lobbyInstance.id, {
            activitys: {
              [lobbyInstance.currentActivityId]: {
                currentViewCategory: e.target.value
              }
            }
          })
        // setValue("gameRoom.gameMetadata", experienceModel.gameRooms[newGameRoomId].gameMetadata)
      }} value={activity.currentViewCategory} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(ActivitySwitcher);
