import { connect } from "react-redux"
import { compose } from "redux"
import { SINGLE_RELATION_TAG_EFFECT_IID, TWO_RELATION_TAG_EFFECT_IID } from "../../../constants/interfaceIds"
import Divider from "../../../ui/Divider/Divider"
import NestedList, { NestedListContainer, NestedListItem } from "../../../ui/NestedList/NestedList"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { effectEditInterfacess } from "../../constants"
import EffectShorthand from "../../effect/EffectShorthand/EffectShorthand"
import EventShorthand from "../../event/EventShorthand/EventShorthand"
import Texture from "../../textures/Texture/Texture"

function renderRelationTag(relationTag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2em'}}>
    <span style={{width: '.6em', height: '.6em'}}>
      <Texture textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
    </span>
    <span>{relationTag.name}</span>
  </span>
}

function RelationShorthand({relation, onClickEvent, useListForEffects = true, gameModel: { gameModel: { events, effects, relationTags } }}) {
  const event = events[relation.eventId]

  function renderEffectedTags(effect, effectId) {
    const effectEditInterfaces = effectEditInterfacess[effect.effectBehavior]
    const relationEffect = relation.effects[effectId]

    if(!relationEffect) return 

    const relationTagA = relationTags[event.relationTagIdA]
    const relationTagB = relationTags[event.relationTagIdB]

    if(effectEditInterfaces.effectableType === SINGLE_RELATION_TAG_EFFECT_IID) {
      if(relationEffect.effectTagA) {
        return renderRelationTag(relationTagA)
      } else {
        return renderRelationTag(relationTagB)
      }
    }

    if(effectEditInterfaces.effectableType === TWO_RELATION_TAG_EFFECT_IID) {
      return <>
        {relationEffect.effectTagA && renderRelationTag(relationTagA)}
        {relationEffect.effectTagB && renderRelationTag(relationTagB)}
      </>
    }
  }
  
  if(!useListForEffects) return <span 
  style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column'}}
  >
    <EventShorthand event={event}/>
    {relation.effectIds.map((effectId) => {
      const effect = effects[effectId]
      return <>
        <EffectShorthand effect={effect}>
          {renderEffectedTags(effect, effectId)}
        </EffectShorthand>
      </>
    })}
  </span>

  return <span 
  // style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column'}}
  >
      <NestedListItem>
        <EventShorthand onClick={onClickEvent} event={event}/>
      </NestedListItem>
      <NestedListItem>
        <NestedListContainer>
          <NestedList interfaceId={relation.relationId} title={'Effects'}>
          {relation.effectIds.map((effectId) => {
            const effect = effects[effectId]
            return <>
              <EffectShorthand effect={effect}>
                {renderEffectedTags(effect, effectId)}
              </EffectShorthand>
            </>
          })}
          </NestedList>
      </NestedListContainer>
    </NestedListItem>

    <Divider/>

  </span>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, {}),
)(RelationShorthand);
