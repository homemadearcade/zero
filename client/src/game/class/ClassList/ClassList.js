/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassList.scss';
import { editGameModel } from '../../../store/actions/gameActions';
import ClassItem from '../ClassItem/ClassItem';
import CreateClassFlow from '../CreateClassFlow/CreateClassFlow';
import { openCreateClassFlow } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { HERO_CLASS, HERO_INSTANCE_CANVAS_ID, MOVEMENT_NONE, MOVEMENT_TURN_ON_COLLIDE, NPC_CLASS, OBJECT_CLASS, OBJECT_INSTANCE_CANVAS_ID, ZONE_CLASS, ZONE_INSTANCE_CANVAS_ID } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';

const ClassList = ({
  game: { gameModel },
  gameFormEditor: { isCreateClassFlowOpen },
  editGameModel,
  openCreateClassFlow,
}) => {
  const classes = gameModel?.classes

  if(!classes) {
    return null
  }

  const objectClasses = Object.keys(classes).filter((currentClassId) => {
    const currentClass = classes[currentClassId]
    if(currentClass.type === OBJECT_CLASS) return true
    return false
  }).map((currentClassId, i) => {
    const el = <ClassItem key={i} classId={currentClassId}/>
    const currentClass = classes[currentClassId]
    if(currentClass.interfaceLocked) return <Unlockable interfaceId={'lockedClass/' + currentClass.name}>
      {el}
    </Unlockable>

    return el
  })

  objectClasses.push(<Unlockable interfaceId={OBJECT_INSTANCE_CANVAS_ID + '/addObject'}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow({ 
        type: OBJECT_CLASS,
        movement: {
          pattern: MOVEMENT_NONE,
        },
        collisionResponse: {
          notPushable: true,
          mass: 100,
          bounciness: 0,
        }
      })
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

  npcClasses.push(<Unlockable interfaceId={OBJECT_INSTANCE_CANVAS_ID + '/addNPC'}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow({ 
        type: NPC_CLASS,
        // movement: {
        //   pattern: MOVEMENT_TURN_ON_COLLIDE,
        //   velocityX: 50,
        // },
        // collisionResponse: {
        //   bounciness: 0.5,
        // }
     })
    }}>
      +
    </Button>
  </Unlockable>)

  const heroClasses = Object.keys(classes).filter((currentClassId) => {
    const currentClass = classes[currentClassId]
    if(currentClass.type === HERO_CLASS) return true
    return false
  }).map((currentClassId, i) => {
    const el = <ClassItem key={i} classId={currentClassId}/>
    const currentClass = classes[currentClassId]
    if(currentClass.interfaceLocked) return <Unlockable interfaceId={'lockedClass/' + currentClass.name}>
      {el}
    </Unlockable>

    return el
  })
  
  heroClasses.push(<Unlockable interfaceId={HERO_INSTANCE_CANVAS_ID + '/addPlayer'}>
    <Button size="fit" 
      onClick={() => {
        openCreateClassFlow({ type: HERO_CLASS })
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
      openCreateClassFlow({ 
        type: ZONE_CLASS, 
        collisionResponse: {
          immovable: true,
        },
        graphics: {
          invisible: true
        }
      })
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  if(!getInterfaceIdData(OBJECT_INSTANCE_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'objects',
      title: <>
        <Typography component="div" variant="subtitle1">Objects</Typography>
        <LayerVisibility canvasId={OBJECT_INSTANCE_CANVAS_ID} />
      </>,
      body: <BorderedGrid
        maxItems={18} 
        height="7vh"
        width="9.2vh"
        items={objectClasses}
      />
    })
  }

  if(!getInterfaceIdData(OBJECT_INSTANCE_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'NPCs',
      title: <>
        <Typography component="div" variant="subtitle1">NPCs</Typography>
        <LayerVisibility canvasId={OBJECT_INSTANCE_CANVAS_ID} />
      </>,
      body: <BorderedGrid
        maxItems={18} 
        height="7vh"
        width="9.2vh"
        items={npcClasses}
      />
    })
  }

  if(!getInterfaceIdData(HERO_INSTANCE_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'heros',
      title: <>
        <Typography component="div" variant="subtitle1">Players</Typography>
        <LayerVisibility canvasId={HERO_INSTANCE_CANVAS_ID} />
      </>,
      body: <BorderedGrid
        maxItems={18} 
        height="7vh"
        width="9.2vh"
        items={heroClasses}
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
              ...objectClass
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
  game: state.game,
  gameFormEditor: state.gameFormEditor,
})
export default compose(
  connect(mapStateToProps, { editGameModel, openCreateClassFlow }),
)(ClassList);
