import { compose } from "redux"
import { ENTITY_RELATION_TAGS_IID } from "../../../constants/interfaceIds"
import FormLabel from "../../../ui/FormLabel/FormLabel"
import { mapCobrowsingState } from "../../../utils"
import { RelationTagChip } from "../../tags/RelationTagChip/RelationTagChip"
import SelectRelationTag from "../../ui/SelectRelationTag/SelectRelationTag"
import { connect } from "react-redux"
import SelectRelationTagFiltered from "../../ui/SelectRelationTagFiltered/SelectRelationTagFiltered"

const EntityModelRelationTags = ({ 
  gameModel: { gameModel },
  entityModel,
  onUpdate,
}) => {
  return <div className="EntityModelRelationTags">
    <FormLabel>Relationship Tags</FormLabel>
    <div className="EditEntityDialog__read-only-tags">
      {Object.keys(entityModel.relationTags).map((relationTagId) => {
        const entityModelRelationTag = entityModel.relationTags[relationTagId]
        if(entityModelRelationTag?.isReadOnly) {
          const relationTag = gameModel.relationTags[relationTagId]
          return <RelationTagChip key={relationTagId} relationTag={relationTag} />
        }

        return null
      })}
      
    </div>
    <SelectRelationTagFiltered 
      entityModel={entityModel}
      interfaceId={ENTITY_RELATION_TAGS_IID} onChange={({relationTags}) => {
      onUpdate({
        relationTags
      })
    }}/>
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { }),
)(EntityModelRelationTags);

