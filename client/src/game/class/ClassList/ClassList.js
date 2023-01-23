/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassList.scss';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ClassItem from '../ClassItem/ClassItem';
import CreateClassFlow from '../CreateClassFlow/CreateClassFlow';
import { openCreateClassFlow } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { PLAYER_CLASS, PLAYER_INSTANCE_CANVAS_ID, NPC_CLASS, NPC_INSTANCE_CANVAS_ID, BASIC_CLASS, BASIC_INSTANCE_CANVAS_ID, ZONE_CLASS, ZONE_INSTANCE_CANVAS_ID } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { defaultZoneClass, defaultNpcClass, defaultPlayerClass, defaultObjectClass } from '../../defaultData/class';
import { directionalClass, jumperClass } from '../../defaultData/players';

const ClassList = ({
  gameModel: { gameModel },
  gameFormEditor: { isCreateClassFlowOpen },
  editGameModel,
  openCreateClassFlow,
}) => {
  const classes = gameModel?.classes

  if(!classes) {
    return null
  }

  function addDefaultValuesToPlayerClass(objectClass) {
    if(gameModel.defaults?.boundaryRelation) objectClass.boundaryRelation = gameModel.defaults?.boundaryRelation
    if(gameModel.defaults?.playerClass === 'JUMPER_PLAYER') {
      objectClass.movement = { ...jumperClass.movement }
      objectClass.jump = { ...jumperClass.jump }
    } else {
      objectClass.movement = { ...directionalClass.movement }
      objectClass.jump = { ...directionalClass.jump }
    }

    return objectClass
  }

  const playerClasses = Object.keys(classes).filter((currentClassId) => {
  const currentClass = classes[currentClassId]
    if(currentClass.type === PLAYER_CLASS) return true
    return false
  }).map((currentClassId, i) => {
    const el = <ClassItem key={i} classId={currentClassId}/>
    const currentClass = classes[currentClassId]
    if(currentClass.interfaceLocked) return <Unlockable interfaceId={'lockedClass/' + currentClass.name}>
      {el}
    </Unlockable>

    return el
  })
  
  playerClasses.push(<Unlockable interfaceId={PLAYER_INSTANCE_CANVAS_ID + '/addPlayer'}>
    <Button size="fit" 
      onClick={() => {
        openCreateClassFlow(addDefaultValuesToPlayerClass({...defaultPlayerClass}))
      }}>
      +
    </Button>
  </Unlockable>)

  const npcClasses = Object.keys(classes).filter((currentClassId) => {
    const currentClass = classes[currentClassId]
    if(currentClass.type === NPC_CLASS) return true
    return false
  }).map((currentClassId, i) => {
    const el = <ClassItem key={i} classId={currentClassId}/>
    const currentClass = classes[currentClassId]
    if(currentClass.interfaceLocked) return <Unlockable interfaceId={'lockedClass/' + currentClass.name}>
      {el}
    </Unlockable> 
    
    return el
  })

  npcClasses.push(<Unlockable interfaceId={NPC_INSTANCE_CANVAS_ID + '/addNPC'}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow(defaultNpcClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const objectClasses = Object.keys(classes).filter((currentClassId) => {
  const currentClass = classes[currentClassId]
    if(currentClass.type === BASIC_CLASS) return true
    return false
  }).map((currentClassId, i) => {
    const el = <ClassItem key={i} classId={currentClassId}/>
    const currentClass = classes[currentClassId]
    if(currentClass.interfaceLocked) return <Unlockable interfaceId={'lockedClass/' + currentClass.name}>
      {el}
    </Unlockable>

    return el
  })

  objectClasses.push(<Unlockable interfaceId={BASIC_INSTANCE_CANVAS_ID + '/addObject'}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow(defaultObjectClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const zoneClasses = Object.keys(classes).filter((currentClassId) => {
    const currentClass = classes[currentClassId]
    if(currentClass.type === ZONE_CLASS) return true
    return false
  }).map((currentClassId, i) => {
    const el = <ClassItem key={i} classId={currentClassId} />
    const currentClass = classes[currentClassId]
    if(currentClass.interfaceLocked) return <Unlockable interfaceId={'lockedClass/' + currentClass.name}>
      {el}
    </Unlockable>

    return el
  })

  zoneClasses.push(<Unlockable interfaceId={ZONE_INSTANCE_CANVAS_ID + '/addZone'}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow(defaultZoneClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  if(!getInterfaceIdData(PLAYER_INSTANCE_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'players',
      title: <>
        <Typography component="div" variant="subtitle1">Players</Typography>
        <LayerVisibility canvasId={PLAYER_INSTANCE_CANVAS_ID} />
      </>,
      body: <BorderedGrid
        maxItems={18} 
        height="7vh"
        width="9.2vh"
        items={playerClasses}
      />
    })
  }

  if(!getInterfaceIdData(NPC_INSTANCE_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'NPCs',
      title: <>
        <Typography component="div" variant="subtitle1">NPCs</Typography>
        <LayerVisibility canvasId={NPC_INSTANCE_CANVAS_ID} />
      </>,
      body: <BorderedGrid
        maxItems={18} 
        height="7vh"
        width="9.2vh"
        items={npcClasses}
      />
    })
  }

  if(!getInterfaceIdData(BASIC_INSTANCE_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'objects',
      title: <>
        <Typography component="div" variant="subtitle1">Objects</Typography>
        <LayerVisibility canvasId={BASIC_INSTANCE_CANVAS_ID} />
      </>,
      body: <BorderedGrid
        maxItems={18} 
        height="7vh"
        width="9.2vh"
        items={objectClasses}
      />
    })
  }

  if(!getInterfaceIdData(ZONE_INSTANCE_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'Zones',
      title: <>
        <Typography component="div" variant="subtitle1">Zones</Typography>
        <LayerVisibility canvasId={ZONE_INSTANCE_CANVAS_ID} />
      </>,
      body: <BorderedGrid
        maxItems={18} 
        height="7vh"
        width="9.2vh"
        items={zoneClasses}
      />
    })
  }

  return <div className="ClassList">
    <CobrowsingAccordianList
      listId="ClassList"
      accordians={accordians}
    />
    {isCreateClassFlowOpen && <CreateClassFlow 
      onComplete={(objectClass) => {
        editGameModel({
          classes: {
            [objectClass.classId] : {
              ...objectClass,
              isNew: false
              // graphics: objectClass.graphics,
              // descriptors: objectClass.descriptors,
              // name: objectClass.name,
              // classId: objectClass.classId,
              // type: objectClass.type,
              // interfaceLocked: objectClass.interfaceLocked
            }
          }
        })
      }}
  />}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
})
export default compose(
  connect(mapStateToProps, { editGameModel, openCreateClassFlow }),
)(ClassList);
