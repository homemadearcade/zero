import { connect } from "react-redux"
import { compose } from "redux"
import Divider from "../../../ui/Divider/Divider"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { effectBehaviorInterfaces, SINGLE_RELATION_TAG_EFFECT, TWO_RELATION_TAG_EFFECT } from "../../constants"
import EffectShorthand from "../../effect/EffectShorthand/EffectShorthand"
import EventShorthand from "../../event/EventShorthand/EventShorthand"
import Sprite from "../../images/Texture/Texture"

function renderRelationTag(relationTag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2em'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
    </span>
    <span>{relationTag.name}</span>
  </span>
}


function RelationShorthand({relation, gameModel: { gameModel: { events, effects, relationTags } }}) {
  const event = events[relation.eventId]

  function renderEffectedTags(effect, effectId) {
    const effectBehaviorInterface = effectBehaviorInterfaces[effect.effectBehavior]
    const relationEffect = relation.effects[effectId]

    if(!relationEffect) return 

    const relationTagA = relationTags[event.relationTagIdA]
    const relationTagB = relationTags[event.relationTagIdB]

    if(effectBehaviorInterface.effectableType === SINGLE_RELATION_TAG_EFFECT) {
      if(relationEffect.effectTagA) {
        return renderRelationTag(relationTagA)
      } else {
        return renderRelationTag(relationTagB)
      }
    }

    if(effectBehaviorInterface.effectableType === TWO_RELATION_TAG_EFFECT) {
      return <>
        {relationEffect.effectTagA && renderRelationTag(relationTagA)}
        {relationEffect.effectTagB && renderRelationTag(relationTagB)}
      </>
    }
  }


  return <span style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column'}}>
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
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, {}),
)(RelationShorthand);
