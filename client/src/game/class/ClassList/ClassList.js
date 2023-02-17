/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassList.scss';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ClassItem from '../ClassItem/ClassItem';
import CreateClassFlow from '../CreateClassFlow/CreateClassFlow';
import { openCreateClassFlow, openCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { PLAYER_CLASS, PLAYER_INSTANCE_CANVAS_ID, NPC_CLASS, BASIC_CLASS, ZONE_CLASS, ZONE_INSTANCE_CANVAS_ID } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { defaultZoneClass, defaultNpcClass, defaultPlayerClass, defaultObjectClass } from '../../defaultData/class';
import { directionalClass, jumperClass } from '../../defaultData/players';
import { BASIC_CLASS_ADD_IID, BASIC_CLASS_CONTAINER_IID, CLASS_UNLOCKABLE_IID, DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, getSelectClassFromClassType, NPC_CLASS_ADD_IID, NPC_CLASS_CONTAINER_IID, OPEN_CLASS_BOX_IID, PLAYER_CLASS_ADD_IID, PLAYER_CLASS_CONTAINER_IID, ZONE_CLASS_ADD_IID, ZONE_CLASS_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openClassBoxModal } from '../../../store/actions/gameSelectorActions';
import { sortByLastSelectedDate } from '../../../utils/editorUtils';

const CLASS_MAX = 16

const ClassList = ({
  gameModel: { gameModel },
  gameFormEditor: { isCreateClassFlowOpen },
  editGameModel,
  openCreateClassFlow,
  openCreateCutscene,
  gameViewEditor: {layerVisibility},
  openClassBoxModal
}) => {
  const classes = gameModel?.classes
  const cutscenes = gameModel?.cutscenes

  if(!classes) {
    return null
  }

  const renderClassItem = (classType) =>  (currentClassId, i) => {
    const el = <ClassItem key={i} classId={currentClassId}/>
    const currentClass = classes[currentClassId]
    if(currentClass.interfaceLocked) {
      return <Unlockable interfaceIdPrefix={classType} interfaceId={CLASS_UNLOCKABLE_IID} interfaceIdExtension={currentClass.name.replace(/\s+/g, '')}>
        {el}
      </Unlockable>
    } else {
      return <Unlockable interfaceId={getSelectClassFromClassType(classType)}>
        {el}
      </Unlockable>
    }
  }

  function renderClassBoxButton(classType){
    return <Unlockable interfaceId={OPEN_CLASS_BOX_IID}>
      <Button size="fit" className="ClassList__more" onClick={() => {
        openClassBoxModal(classType)
      }}>
        More
      </Button>
    </Unlockable>
  }


  const filterClasses = (classType) => (currentClassId) => {
    const currentClass = classes[currentClassId]
    if(currentClass.isRemoved) return false
    if(currentClass.type === classType) return true
    return false
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

  const playerClasses = Object.keys(classes).
    filter(filterClasses(PLAYER_CLASS)). 
    sort(sortByLastSelectedDate(classes)).
    map(renderClassItem(PLAYER_CLASS)).slice(0, CLASS_MAX -1)
  
  playerClasses.push(<Unlockable interfaceId={PLAYER_CLASS_ADD_IID}>
    <Button size="fit" 
      onClick={() => {
        openCreateClassFlow(addDefaultValuesToPlayerClass({...defaultPlayerClass}))
      }}>
      +
    </Button>
  </Unlockable>)

  const npcClasses = Object.keys(classes).
    filter(filterClasses(NPC_CLASS)).
    sort(sortByLastSelectedDate(classes)).
    map(renderClassItem(NPC_CLASS)).slice(0, CLASS_MAX -1)

  npcClasses.push(<Unlockable interfaceId={NPC_CLASS_ADD_IID}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow(defaultNpcClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const basicClasses = Object.keys(classes).
    filter(filterClasses(BASIC_CLASS)).
    sort(sortByLastSelectedDate(classes)).
    map(renderClassItem(BASIC_CLASS)).slice(0, CLASS_MAX -1)


  basicClasses.push(<Unlockable interfaceId={BASIC_CLASS_ADD_IID}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow(defaultObjectClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const zoneClasses = Object.keys(classes).
    filter(filterClasses(ZONE_CLASS)).
    sort(sortByLastSelectedDate(classes)).
    map(renderClassItem(ZONE_CLASS)).
    slice(0, CLASS_MAX -1)

  zoneClasses.push(<Unlockable interfaceId={ZONE_CLASS_ADD_IID}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateClassFlow(defaultZoneClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const dialogueScenes = Object.keys(gameModel.cutscenes).filter((currentCutsceneId) => {
    const currentCutscene = cutscenes[currentCutsceneId]
    if(currentCutscene.isRemoved) return false
    if(currentCutscene.inDialogueMenu) return true
    return false
  }).map((currentCutsceneId, i) => {
    const currentCutscene = cutscenes[currentCutsceneId]
    return <Unlockable interfaceId={DIALOGUE_SELECT_IID}>
      <div style={{cursor:'hover'}} onClick={() => {openCreateCutscene(currentCutscene)}}>
        <Typography variant="subtitle2">{currentCutscene.name}</Typography>
      </div>
    </Unlockable>
  })

  dialogueScenes.push(<Unlockable interfaceId={DIALOGUE_ADD_IID}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openCreateCutscene({
        inDialogueMenu: true
      })
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  const hiddenOpacity = 0.5
  accordians.push({
    id: 'players',
    interfaceId: PLAYER_CLASS_CONTAINER_IID,
    sx: !layerVisibility[PLAYER_INSTANCE_CANVAS_ID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography sx={!layerVisibility[PLAYER_INSTANCE_CANVAS_ID] ? {opacity: hiddenOpacity} : {}} component="div" variant="subtitle1">Players</Typography>
    </>,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="7vh"
        width="9.2vh"
        items={playerClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility canvasId={PLAYER_INSTANCE_CANVAS_ID} />
        {Object.keys(playerClasses).length >= CLASS_MAX && renderClassBoxButton(PLAYER_CLASS)}
      </div>
    </>
  })

  accordians.push({
    id: 'NPCs',
    interfaceId: NPC_CLASS_CONTAINER_IID,
    sx: !layerVisibility[NPC_CLASS] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">NPCs</Typography>
    </>,
    body: <>
      <BorderedGrid
      maxItems={CLASS_MAX} 
      height="7vh"
      width="9.2vh"
      items={npcClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility canvasId={NPC_CLASS} />
        {Object.keys(npcClasses).length >= CLASS_MAX && renderClassBoxButton(NPC_CLASS)}
      </div>
    </>
  })

  accordians.push({
    id: 'objects',
    interfaceId: BASIC_CLASS_CONTAINER_IID,
    sx: !layerVisibility[BASIC_CLASS] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Objects</Typography>
    </>,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="7vh"
        width="9.2vh"
        items={basicClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility canvasId={BASIC_CLASS} />
        {Object.keys(basicClasses).length >= CLASS_MAX && renderClassBoxButton(BASIC_CLASS)}
      </div>
    </>
  })

  accordians.push({
    id: 'zones',
    interfaceId: ZONE_CLASS_CONTAINER_IID,
    sx: !layerVisibility[ZONE_INSTANCE_CANVAS_ID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography  component="div" variant="subtitle1">Zones</Typography>
    </>,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="7vh"
        width="9.2vh"
        items={zoneClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility canvasId={ZONE_INSTANCE_CANVAS_ID} />
        {Object.keys(zoneClasses).length >= CLASS_MAX && renderClassBoxButton(ZONE_CLASS)}
      </div>
    </>
  })

  accordians.push({
    id: 'dialogue',
    interfaceId: DIALOGUE_CONTAINER_IID,
    title: <>
      <Typography component="div" variant="subtitle1">Dialogue</Typography>
    </>,
    body: <BorderedGrid
      maxItems={CLASS_MAX} 
      height="7vh"
      width="9.2vh"
      items={dialogueScenes}
    />
  })

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
  gameViewEditor: state.gameViewEditor,
  // for the unlockability to show up
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { editGameModel, openCreateClassFlow, openCreateCutscene, openClassBoxModal }),
)(ClassList);
