import { connect } from "react-redux"
import { compose } from "redux"
import Typography from "../../../ui/Typography/Typography"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { eventShortNames, PLAYER_AND_RELATION_TAG_EVENT, SINGLE_RELATION_TAG_EVENT, TWO_RELATION_TAG_EVENT, eventTypeInterfaces } from "../../constants"
import Sprite from "../../images/Texture/Texture"

function renderRelationTag(relationTag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
    </span>
    <span>{relationTag.name}</span>
  </span>
}

function renderEventName(event) {
  const displayName = eventShortNames[event.eventType]
  return  <Typography sx={{ fontWeight: 'bold' }} component="span">{displayName}</Typography>
}

function EventShorthand({event, gameModel: { gameModel }}) {
  const eventType = event.eventType 
  const relationTags = gameModel.relationTags 
  const relationTagA = relationTags[event.relationTagIdA]
  const relationTagB = relationTags[event.relationTagIdB] 

  const eventTypeInterface = eventTypeInterfaces[eventType]

  function renderBody() {
    if(eventTypeInterface.relationTagSelectType === SINGLE_RELATION_TAG_EVENT) {
      return <>
        {renderEventName(event)}
        {renderRelationTag(relationTagA)}

      </>
    }

    if(eventTypeInterface.relationTagSelectType === TWO_RELATION_TAG_EVENT) {
      return <>
        {renderEventName(event)}
        <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {renderRelationTag(relationTagA)}
          {renderRelationTag(relationTagB)}
        </span>
      </>
    }
    
    if(eventTypeInterface.relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT) {
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

  return <span style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'row'}}>
    {renderBody()}
  </span>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, {}),
)(EventShorthand);
