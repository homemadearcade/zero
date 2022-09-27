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
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import BorderedGrid from '../../app/ui/BorderedGrid/BorderedGrid';

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


  const objectClasses = Object.keys(classes).filter((currentClassId) => {
    const currentClass = classes[currentClassId]
    if(currentClass.type === 'hero') return null
    return true
  }).map((currentClassId, i) => {
    return <ClassItem key={i} classId={currentClassId} />
  }).slice(0, 15)

  objectClasses.push(<Button size="fit" className="ClassList__add" onClick={() => {
    openCreateClassFlow()
  }}>
    +
  </Button>)


  const heroClasses = Object.keys(classes).filter((currentClassId) => {
    const currentClass = classes[currentClassId]
    if(currentClass.type !== 'hero') return null
    return true
  }).map((currentClassId, i) => {
    return <ClassItem key={i} classId={currentClassId} hero/>
  }).slice(0, 5)
  
  heroClasses.push(<Button size="fit" onClick={() => {
    const classId = uuidv4()
    editGameModel({
      classes: {
        [classId] : {
          type: 'hero'
        }
      }
    })
  }}>
    +
  </Button>)

  return <div className="ClassList">
    <BorderedGrid
      maxItems={16} 
      height="7vh"
      width="9.2vh"
      items={objectClasses}
    />
    <BorderedGrid
      maxItems={6} 
      height="7vh"
      width="9.2vh"
      items={heroClasses}/>
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
