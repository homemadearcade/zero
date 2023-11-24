import { connect } from "react-redux"
import { compose } from "redux"
import { PLAYER_AND_RELATION_TAG_EVENT_IID, SINGLE_RELATION_TAG_EVENT_IID, TWO_RELATION_TAG_EVENT_IID,
 } from "../../../constants/interfaceIds"
import Typography from "../../../ui/Typography/Typography"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { eventInterfaceData } from "../../constants"
import Texture from "../../textures/Texture/Texture"

function renderRelationTag(relationTag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{
            justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      width: '.6em', height: '.6em'}}>
      <Texture textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
    </span>
    <span>{relationTag.name}</span>
  </span>
}

function renderEventName(event) {
  const displayName = eventInterfaceData[event.eventType].name
  return  <Typography sx={{ fontWeight: 'bold' }} component="span">{'On ' + displayName}</Typography>
}

function EventShorthand({event, onClick, gameModel: { gameModel }}) {
  const eventType = event.eventType 
  const relationTags = gameModel.relationTags 
  const relationTagA = relationTags[event.relationTagIdA]
  const relationTagB = relationTags[event.relationTagIdB] 

  const eventTypeInterface = eventInterfaceData[eventType]

  function renderBody() {
    if(eventTypeInterface.relationTagSelectType === SINGLE_RELATION_TAG_EVENT_IID) {
      return <>
        {renderEventName(event)}
        {renderRelationTag(relationTagA)}

      </>
    }

    if(eventTypeInterface.relationTagSelectType === TWO_RELATION_TAG_EVENT_IID) {
      return <>
        {renderEventName(event)}
        <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {renderRelationTag(relationTagA)}
          {renderRelationTag(relationTagB)}
        </span>
      </>
    }
    
    if(eventTypeInterface.relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT_IID) {
      return <>
        {renderEventName(event)}
        <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {renderRelationTag(relationTagA)}
          {renderRelationTag(relationTagB)}
        </span>
      </>
    }

    return renderEventName(event)
  }

  return <span onClick={onClick} style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'row'}}>
    {renderBody()}
  </span>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, {}),
)(EventShorthand);
