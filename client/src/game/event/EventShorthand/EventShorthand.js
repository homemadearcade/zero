import { connect } from "react-redux"
import { compose } from "redux"
import Typography from "../../../ui/Typography/Typography"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { eventShortNames, PLAYER_AND_TAG_EVENT, SINGLE_TAG_EVENT, TWO_TAG_EVENT, eventTypeInterfaces } from "../../constants"
import Sprite from "../../images/Texture/Texture"

function renderTag(tag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={tag.textureId} textureTint={tag.textureTint}/>
    </span>
    <span>{tag.name}</span>
  </span>
}

function renderEventName(event) {
  const displayName = eventShortNames[event.eventType]
  return  <Typography sx={{ fontWeight: 'bold' }} component="span">{displayName}</Typography>
}

function EventShorthand({event, gameModel: { gameModel }}) {
  const eventType = event.eventType 
  const tags = gameModel.tags 
  const tagA = tags[event.tagIdA]
  const tagB = tags[event.tagIdB] 

  const eventTypeInterface = eventTypeInterfaces[eventType]

  function renderBody() {
    if(eventTypeInterface.tagSelectType === SINGLE_TAG_EVENT) {
      return <>
        {renderEventName(event)}
        {renderTag(tagA)}

      </>
    }

    if(eventTypeInterface.tagSelectType === TWO_TAG_EVENT) {
      return <>
        {renderEventName(event)}
        <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {renderTag(tagA)}
          {renderTag(tagB)}
        </span>
      </>
    }
    
    if(eventTypeInterface.tagSelectType === PLAYER_AND_TAG_EVENT) {
      return <>
        {renderEventName(event)}
        <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {renderTag(tagA)}
          {renderTag(tagB)}
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
