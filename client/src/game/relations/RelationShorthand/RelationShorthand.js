import { connect } from "react-redux"
import { compose } from "redux"
import Divider from "../../../ui/Divider/Divider"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { effectBehaviorInterface, SINGLE_TAG_EFFECT, TWO_TAG_EFFECT } from "../../constants"
import EffectShorthand from "../../effect/EffectShorthand/EffectShorthand"
import EventShorthand from "../../event/EventShorthand/EventShorthand"
import Sprite from "../../sprites/Sprite/Sprite"

function renderTag(tag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={tag.textureId} tint={tag.color}/>
    </span>
    <span>{tag.name}</span>
  </span>
}


function RelationShorthand({relation, gameModel: { gameModel: { events, effects, tags } }}) {
  const event = events[relation.eventId]

  function renderEffectedTags(effect, effectId) {
    const effectInterface = effectBehaviorInterface[effect.effectBehavior]
    const relationEffect = relation.effects[effectId]

    if(!relationEffect) return 

    const tagA = tags[event.tagIdA]
    const tagB = tags[event.tagIdB]

    if(effectInterface.effectableType === SINGLE_TAG_EFFECT) {
      if(relationEffect.effectTagA) {
        return renderTag(tagA)
      } else {
        return renderTag(tagB)
      }
    }

    if(effectInterface.effectableType === TWO_TAG_EFFECT) {
      return <>
        {relationEffect.effectTagA && renderTag(tagA)}
        {relationEffect.effectTagB && renderTag(tagB)}
      </>
    }
  }


  return <span style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column'}}>
    <EventShorthand event={event}/>
    <Divider/>
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
