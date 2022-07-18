/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './GameClassList.scss';
import { Button } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import Loader from '../../components/ui/Loader/Loader';
import ClassItem from '../ClassItem/ClassItem';
import CreateClassFlow from '../CreateClassFlow/CreateClassFlow';
import { closeCreateClassFlow, openCreateClassFlow } from '../../store/actions/editorFormsActions';

const GameClassList = ({
  game: { gameModel },
  editorFormsState: { isCreateClassFlowOpen },
  editGameModel,
  closeCreateClassFlow,
  openCreateClassFlow
}) => {
  const classes = gameModel?.classes

  if(!classes) {
    return <Loader text="No Game Loaded"/>
  }

  return <div className="GameClassList">
    {Object.keys(classes).map((currentClassId, i) => {
      const currentClass = classes[currentClassId]
      if(currentClass.type === 'hero') return null
      return <ClassItem key={i} classId={currentClassId} />
    })}
    <Button className="GameClassList__add" onClick={() => {
      openCreateClassFlow()
    }}>
      Add New Class
    </Button>

    {Object.keys(classes).map((currentClassId, i) => {
      const currentClass = classes[currentClassId]
      if(currentClass.type !== 'hero') return null
      return <ClassItem key={i} classId={currentClassId} hero/>
    })}
    <Button className="GameClassList__add" onClick={() => {
      const classId = uuidv4()
      editGameModel({
        classes: {
          [classId] : {
            type: 'hero'
          }
        }
      })
    }}>
      Add New Hero Class
    </Button>

    {isCreateClassFlowOpen && <CreateClassFlow 
      onClose={() => {
        closeCreateClassFlow()
      }}
      onComplete={(objectClass) => {
        const classId = uuidv4()
        editGameModel({
          classes: {
            [classId] : {
              type: 'object',
              ...objectClass
            }
          }
        })
      }}
    />}
  </div>
};

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  return {
    game: state.game,
    editorFormsState: isCobrowsing ? state.cobrowsing.remoteState.editorForms : state.editorForms.editorFormsState,
  }
};

export default compose(
  connect(mapStateToProps, { editGameModel, openCreateClassFlow, closeCreateClassFlow }),
)(GameClassList);
