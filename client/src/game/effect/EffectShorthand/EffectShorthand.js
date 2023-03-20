import { connect } from "react-redux"
import { compose } from "redux"
import Typography from "../../../ui/Typography/Typography"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { effectBehaviorToDisplayNames, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_TRANSFORM, EFFECT_SPAWN, EFFECT_TELEPORT,
} from "../../constants"
import Sprite from "../../images/Texture/Texture"

function renderTag(tag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={tag.textureId} textureTint={tag.textureTint}/>
    </span>
    <span>{tag.name}</span>
  </span>
}

function renderClass(entityClass) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={entityClass.graphics.textureId} textureTint={entityClass.graphics.textureTint}/>
    </span>
    <span>{entityClass.name}</span>
  </span>
}

function renderEffect(effect) {
  const displayName = effectBehaviorToDisplayNames[effect.effectBehavior]
  return  <Typography sx={{ fontWeight: 'bold' }} component="span">{displayName}</Typography>
}

function renderText(text) {
  return  <Typography sx={{ padding: 'bold' }} component="span">{text}</Typography>
}


function EffectShorthand({effect, gameModel: { gameModel }, children}) {
  const effectBehavior = effect.effectBehavior 
  const entityClasses = gameModel.entityClasses 
  const cutscenes = gameModel.cutscenes 
  const tags = gameModel.tags 

  function renderBody() {
    if(effectBehavior === EFFECT_TELEPORT) {
      return <>
        {renderEffect(effect)}
        {/* {` to`}   */}
        {renderClass(entityClasses[effect.zoneClassId])}
      </>
    }

    if(effectBehavior === EFFECT_TRANSFORM) {
      return <>
        {renderEffect(effect)}
        {/* {` into`} */}
        {renderClass(entityClasses[effect.entityClassId])}
      </>
    }

    if(effectBehavior === EFFECT_SPAWN) {
      return <>
        {renderEffect(effect)}
        {renderClass(entityClasses[effect.spawnClassId])}
        {/* {'into'} */}
        {/* {renderClass(entityClasses[effect.zoneClassId])} */}
      </>
    }

    if(effectBehavior === EFFECT_CUTSCENE) {
      return <>
        {renderEffect(effect)}
        {`${cutscenes[effect.cutsceneId].name}`}
      </>
    }

    if(effectBehavior === EFFECT_DESTROY) {
      if(effect.remoteEffectedTagIds.length) {
        return <>
          {renderEffect(effect)}
          {/* {` all`} */}
          {effect.remoteEffectedTagIds.map((tagId) => tags[tagId]).map(renderTag)}
        </>
      }
    }
  
    return renderEffect(effect)
  }
  
  return <span style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'row'}}>
    {renderBody()}
    {children}
  </span>

}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, {}),
)(EffectShorthand);
