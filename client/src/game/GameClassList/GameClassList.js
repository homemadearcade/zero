/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './GameClassList.scss';
import { Button } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import Loader from '../../components/ui/Loader/Loader';
import ClassItem from '../ClassItem/ClassItem';

const GameClassList = ({
  game: { gameModel },
  editGameModel,
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
      const classId = uuidv4()
      editGameModel({
        classes: {
          [classId] : {
            type: 'object'
          }
        }
      })
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
  </div>
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default compose(
  connect(mapStateToProps, { editGameModel }),
)(GameClassList);
