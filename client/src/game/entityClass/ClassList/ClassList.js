/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassList.scss';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ClassItem from '../ClassItem/ClassItem';
import EditClassGraphics from '../EditClassGraphics/EditClassGraphics';
import { openEditClassGraphics, openCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { PLAYER_CLASS, NPC_CLASS, BASIC_CLASS, ZONE_CLASS, stageDefaultTypeProperties } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { defaultZoneClass, defaultNpcClass, defaultPlayerClass, defaultBasicClass } from '../../constants';
import { BASIC_CLASS_ADD_IID, BASIC_CLASS_CONTAINER_IID, CLASS_UNLOCKABLE_IID, getSelectClassFromClassType, NPC_CLASS_ADD_IID, NPC_CLASS_CONTAINER_IID, OPEN_CLASS_BOX_IID, PLAYER_CLASS_ADD_IID, PLAYER_CLASS_CONTAINER_IID, ZONE_CLASS_ADD_IID, ZONE_CLASS_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openClassBoxModal } from '../../../store/actions/gameSelectorActions';
import { sortByLastEditedDate } from '../../../utils/editorUtils';
import { getInterfaceIdData } from '../../../utils';

const CLASS_MAX = 16

const ClassList = ({
  gameModel: { gameModel, currentStageId },
  gameFormEditor: { isEditClassGraphicsOpen },
  editGameModel,
  openEditClassGraphics,
  gameViewEditor: {layerInvisibility},
  openClassBoxModal
}) => {
  const entityClasses = gameModel?.entityClasses

  if(!entityClasses) {
    return null
  }

  const renderClassItem = (classType) =>  (currentClassId, i) => {
    const el = <ClassItem key={i} entityClassId={currentClassId}/>
    const currentClass = entityClasses[currentClassId]
    if(currentClass.interfaceLocked) {

      // if this is uncommented thats great but it has extra fireworks in cobrowsing...

      // const interfaceIdToUnlock = classType + '/' + CLASS_UNLOCKABLE_IID + '/' + currentClass.entityClassId
      // const {isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceIdToUnlock)
      // if(isObscured) return null
      return <Unlockable interfaceIdPrefix={classType} interfaceId={CLASS_UNLOCKABLE_IID} interfaceIdExtension={currentClass.entityClassId}>
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
    const currentClass = entityClasses[currentClassId]
    if(currentClass.isRemoved) return false
    if(currentClass.editorInterface.notVisibleInSelector) return false
    if(currentClass.classInterfaceCategory === classType) return true
    return false
  }

  function addDefaultValuesToPlayerClass(entityClass) {
    const defaultType = gameModel.stages[currentStageId].defaultType
    if(!defaultType) return entityClass
    const defaultTypeProperties = stageDefaultTypeProperties[defaultType]
    const defaultEntityClass = entityClasses[defaultTypeProperties].playerClassId
    return {...entityClass, ...defaultEntityClass}
  }

  const playerClasses = Object.keys(entityClasses).
    filter(filterClasses(PLAYER_CLASS)). 
    sort(sortByLastEditedDate(entityClasses)).
    map(renderClassItem(PLAYER_CLASS)).filter((item) => !!item).slice(0, CLASS_MAX -1)
  
  playerClasses.push(<Unlockable interfaceId={PLAYER_CLASS_ADD_IID}>
    <Button size="fit" 
      onClick={() => {
        openEditClassGraphics(addDefaultValuesToPlayerClass({...defaultPlayerClass}))
      }}>
      +
    </Button>
  </Unlockable>)

  const npcClasses = Object.keys(entityClasses).
    filter(filterClasses(NPC_CLASS)).
    sort(sortByLastEditedDate(entityClasses)).
    map(renderClassItem(NPC_CLASS)).filter((item) => !!item).slice(0, CLASS_MAX -1)

  npcClasses.push(<Unlockable interfaceId={NPC_CLASS_ADD_IID}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openEditClassGraphics(defaultNpcClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const basicClasses = Object.keys(entityClasses).
    filter(filterClasses(BASIC_CLASS)).
    sort(sortByLastEditedDate(entityClasses)).
    map(renderClassItem(BASIC_CLASS)).filter((item) => !!item).slice(0, CLASS_MAX -1)


  basicClasses.push(<Unlockable interfaceId={BASIC_CLASS_ADD_IID}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openEditClassGraphics(defaultBasicClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const zoneClasses = Object.keys(entityClasses).
    filter(filterClasses(ZONE_CLASS)).
    sort(sortByLastEditedDate(entityClasses)).
    map(renderClassItem(ZONE_CLASS)).filter((item) => !!item).
    slice(0, CLASS_MAX -1)

  zoneClasses.push(<Unlockable interfaceId={ZONE_CLASS_ADD_IID}>
    <Button size="fit" className="ClassList__add" onClick={() => {
      openEditClassGraphics(defaultZoneClass)
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  const hiddenOpacity = 0.5
  accordians.push({
    id: 'players',
    interfaceId: PLAYER_CLASS_CONTAINER_IID,
    sx: layerInvisibility[PLAYER_CLASS] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Players</Typography>
    </>,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="3.3em"
        width="3.95em"
        items={playerClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility layerId={PLAYER_CLASS} />
        {Object.keys(playerClasses).length >= CLASS_MAX && renderClassBoxButton(PLAYER_CLASS)}
      </div>
    </>
  })

  accordians.push({
    id: 'NPCs',
    interfaceId: NPC_CLASS_CONTAINER_IID,
    sx: layerInvisibility[NPC_CLASS] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">NPCs</Typography>
    </>,
    body: <>
      <BorderedGrid
      maxItems={CLASS_MAX} 
      height="3.3em"
        width="3.95em"
      items={npcClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility layerId={NPC_CLASS} />
        {Object.keys(npcClasses).length >= CLASS_MAX && renderClassBoxButton(NPC_CLASS)}
      </div>
    </>
  })

  accordians.push({
    id: 'objects',
    interfaceId: BASIC_CLASS_CONTAINER_IID,
    sx: layerInvisibility[BASIC_CLASS] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Objects</Typography>
    </>,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="3.3em"
        width="3.95em"
        items={basicClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility layerId={BASIC_CLASS} />
        {Object.keys(basicClasses).length >= CLASS_MAX && renderClassBoxButton(BASIC_CLASS)}
      </div>
    </>
  })

  accordians.push({
    id: 'zones',
    interfaceId: ZONE_CLASS_CONTAINER_IID,
    sx: layerInvisibility[ZONE_CLASS] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Zones</Typography>
    </>,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="3.3em"
        width="3.95em"
        items={zoneClasses}
      />
      <div className="ClassList__tools">
        <LayerVisibility layerId={ZONE_CLASS} />
        {Object.keys(zoneClasses).length >= CLASS_MAX && renderClassBoxButton(ZONE_CLASS)}
      </div>
    </>
  })


  return <div className="ClassList">
    <CobrowsingAccordianList
      listId="LeftColumn"
      accordians={accordians}
    />
    {isEditClassGraphicsOpen && <EditClassGraphics 
      onComplete={(entityClass) => {
        editGameModel({
          entityClasses: {
            [entityClass.entityClassId] : {
              ...entityClass,
              isNew: false,
              // graphics: entityClass.graphics,
              // visualTags: entityClass.visualTags,
              // name: entityClass.name,
              // entityClassId: entityClass.entityClassId,
              // classInterfaceCategory: entityClass.classInterfaceCategory,
              // interfaceLocked: entityClass.interfaceLocked,
              // layerId: entityClass.layerId
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
  connect(mapStateToProps, { editGameModel, openEditClassGraphics, openCreateCutscene, openClassBoxModal }),
)(ClassList);
