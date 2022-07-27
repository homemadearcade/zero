/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './ClassList.scss';
import { editGameModel } from '../../store/actions/gameActions';
import ClassItem from '../ClassItem/ClassItem';
import CreateClassFlow from '../CreateClassFlow/CreateClassFlow';
import { openCreateClassFlow } from '../../store/actions/editorFormsActions';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const ClassList = ({
  game: { gameModel },
  editorForms: { isCreateClassFlowOpen },
  editGameModel,
  openCreateClassFlow,
}) => {
  const classes = gameModel?.classes

  if(!classes) {
    return null
  }

  return <div className="ClassList">
    {Object.keys(classes).map((currentClassId, i) => {
      const currentClass = classes[currentClassId]
      if(currentClass.type === 'hero') return null
      return <ClassItem key={i} classId={currentClassId} />
    })}
    <Button className="ClassList__add" onClick={() => {
      openCreateClassFlow()
    }}>
      Add New Class
    </Button>

    {Object.keys(classes).map((currentClassId, i) => {
      const currentClass = classes[currentClassId]
      if(currentClass.type !== 'hero') return null
      return <ClassItem key={i} classId={currentClassId} hero/>
    })}
    <Button className="ClassList__add" onClick={() => {
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

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms,
})
export default compose(
  connect(mapStateToProps, { editGameModel, openCreateClassFlow }),
)(ClassList);
