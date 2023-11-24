import { MenuItem } from "@mui/material"
import { PLAYER_AND_RELATION_TAG_EVENT_IID, PLAYER_ENTITY_IID, SINGLE_RELATION_TAG_EVENT_IID, TWO_RELATION_TAG_EVENT_IID } from "../../../constants/interfaceIds"
import ButtonMenu from "../../../ui/ButtonMenu/ButtonMenu"
import { eventInterfaceData, PLAYER_RELATION_TAG_ID } from "../../constants"
import { openCreateRelation } from "../../../store/actions/game/gameFormEditorActions"
import { mapCobrowsingState } from "../../../utils"
import { compose } from "redux"
import { connect } from "react-redux"

const CreateRelationForRelationTag = ({
  relationTag,
  openCreateRelation
 }) => {

  console.log(relationTag)

    return <ButtonMenu variant="outlined" text={"Add New Relationship for " + relationTag.name} menu={(handleClose) => {
    return [Object.keys(eventInterfaceData).map((eventType) => {
      const eventInterface = eventInterfaceData[eventType]
      if(
        eventInterface.relationTagSelectType !== PLAYER_AND_RELATION_TAG_EVENT_IID &&
        eventInterface.relationTagSelectType !== SINGLE_RELATION_TAG_EVENT_IID && 
        eventInterface.relationTagSelectType !== TWO_RELATION_TAG_EVENT_IID
      ) return null

      const eventName = eventInterfaceData[eventType].name
      
      return <MenuItem key={eventType} onClick={() => {
        const event = {
          eventType,
        }

        if(eventInterface.relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT_IID) {
          event.relationTagIdA = PLAYER_RELATION_TAG_ID
          event.relationTagIdB = relationTag.relationTagId
        } else if(eventInterface.relationTagSelectType === SINGLE_RELATION_TAG_EVENT_IID) {
          event.relationTagIdA = relationTag.relationTagId
        } else if(eventInterface.relationTagSelectType === TWO_RELATION_TAG_EVENT_IID) {
          event.relationTagIdA = relationTag.relationTagId
        }

        openCreateRelation({
          // relationId: RELATION_DID+generateUniqueId(),
          event,
        })
        
        handleClose()

      }}>
        {'On ' + eventName + ' Event'}
      </MenuItem>

    })]
  }}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  // gameFormEditor: state.gameFormEditor,
  // gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { openCreateRelation }),
)(CreateRelationForRelationTag);

