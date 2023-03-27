
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import IconTree, { IconTreeNode } from '../../../ui/IconTree/IconTree';
import AccordianList from '../../../ui/AccordianList/AccordianList';
import Icon from '../../../ui/Icon/Icon';
import Button from '../../../ui/Button/Button';

const ExperienceCreatorMenu = ({
  experience: { experience }
}) => {

        //   <Button size="wide"
        //   onClick={() => {

        //   }}
        //   startIcon={<Icon icon="faPlus"></Icon>}
        // >
        //   New Activity
        // </Button>
  const lobbyNodes = Object.keys(experience.lobbys).map((lobbyId) => {
    const lobby = experience.lobbys[lobbyId]
    const activityNodes = Object.keys(lobby.activitys).map((activityId) => {
      const activity = lobby.activitys[activityId]

      return {
        icon: <Icon icon='faPenToSquare'></Icon>,
        label: activity.name,
        id: activityId,
      }
    })

    return {
      id: lobbyId,
      label: lobby.name,
      icon: <Icon icon='faPenToSquare'></Icon>,
      children: activityNodes
    }
  })

  console.log(lobbyNodes)

  return (
    <div className="ExperienceCreatorMenu">
      <IconTree nodes={lobbyNodes}>
      </IconTree>
      <Button size="wide"
        onClick={() => {

        }}
        startIcon={<Icon icon="faPlus"></Icon>}
      >
        New Lobby
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  experience: state.experience,
});

export default compose(
  connect(mapStateToProps, { }),
)(ExperienceCreatorMenu);
