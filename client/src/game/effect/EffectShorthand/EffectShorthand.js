import { connect } from "react-redux"
import { compose } from "redux"
import Typography from "../../../ui/Typography/Typography"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { effectInterfaceDatas, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_TRANSFORM, EFFECT_SPAWN, EFFECT_TELEPORT, EFFECT_SWITCH_STAGE,
} from "../../constants"
import Sprite from "../../textures/Texture/Texture"

function renderRelationTag(relationTag) {
  return <span key={relationTag.relationTagId} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2em'}}>
    <span style={{width: '.6em', height: '.6em'}}>
      <Sprite textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
    </span>
    <span>{relationTag.name}</span>
  </span>
}

function renderEntity(entityModel) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2em'}}>
    <span style={{width: '.6em', height: '.6em'}}>
      <Sprite textureId={entityModel.graphics.textureId} textureTint={entityModel.graphics.textureTint}/>
    </span>
    <span>{entityModel.name}</span>
  </span>
}

function renderStage(stage) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2em'}}>
    {stage.backgroundColor && <span style={{width: '.6em', height: '.6em'}}>
      <Sprite textureTint={stage.backgroundColor}/>
    </span>}
    <span>{stage.name}</span>
  </span>
}

function renderEffect(effect) {
  const displayName = effectInterfaceDatas[effect.effectBehavior].displayName
  return  <Typography sx={{ fontWeight: 'bold' }} component="span">{displayName}</Typography>
}

function renderText(text) {
  return  <Typography sx={{ padding: 'bold' }} component="span">{text}</Typography>
}

function EffectShorthand({effect, gameModel: { gameModel }, children}) {
  const effectBehavior = effect.effectBehavior 
  const entityModels = gameModel.entityModels 
  const cutscenes = gameModel.cutscenes 
  const relationTags = gameModel.relationTags 
  const stages = gameModel.stages 

  function renderBody() {
    if(effectBehavior === EFFECT_TELEPORT) {
      return <>
        {renderEffect(effect)}
        {/* {` to`}   */}
        {renderEntity(entityModels[effect.zoneEntityModelId])}
      </>
    }

    if(effectBehavior === EFFECT_TRANSFORM) {
      return <>
        {renderEffect(effect)}
        {/* {` into`} */}
        {renderEntity(entityModels[effect.entityModelId])}
      </>
    }

    if(effectBehavior === EFFECT_SPAWN) {
      return <>
        {renderEffect(effect)}
        {renderEntity(entityModels[effect.spawnEntityModelId])}
        {/* {'into'} */}
        {/* {renderEntity(entityModels[effect.zoneEntityModelId])} */}
      </>
    }

    if(effectBehavior === EFFECT_CUTSCENE) {
      return <>
        {renderEffect(effect)}
        {`${cutscenes[effect.cutsceneId].name}`}
      </>
    }

    if(effectBehavior === EFFECT_DESTROY) {
      if(effect.remoteEffectedRelationTagIds?.length) {
        return <>
          {renderEffect(effect)}
          {/* {` all`} */}
          {effect.remoteEffectedRelationTagIds.map((relationTagId) => relationTags[relationTagId]).map(renderRelationTag)}
        </>
      }
    }

    if(effectBehavior === EFFECT_SWITCH_STAGE) {
      return <>
        {renderEffect(effect)}
        {renderStage(stages[effect.stageId])}
      </>
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
