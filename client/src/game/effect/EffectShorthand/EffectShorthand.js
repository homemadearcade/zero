import { connect } from "react-redux"
import { compose } from "redux"
import Typography from "../../../ui/Typography/Typography"
import { mapCobrowsingState } from "../../../utils/cobrowsingUtils"
import { effectDisplayNames, effectEditInterface, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_TELEPORT, eventEditInterface, eventShortNames, PLAYER_AND_TAG_EVENT, SINGLE_TAG_EFFECT, SINGLE_TAG_EVENT, TWO_TAG_EFFECT, TWO_TAG_EVENT } from "../../constants"
import Sprite from "../../sprites/Sprite/Sprite"

function renderTag(tag) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={tag.textureId} tint={tag.color}/>
    </span>
    <span>{tag.name}</span>
  </span>
}

function renderClass(objectClass) {
  return <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '.2rem'}}>
    <span style={{width: '10px', height: '10px'}}>
      <Sprite textureId={objectClass.graphics.textureId} tint={objectClass.graphics.tint}/>
    </span>
    <span>{objectClass.name}</span>
  </span>
}

function renderEffect(effect) {
  const displayName = effectDisplayNames[effect.type]
  return  <Typography sx={{ fontWeight: 'bold' }} component="span">{displayName}</Typography>
}

function renderText(text) {
  return  <Typography sx={{ padding: 'bold' }} component="span">{text}</Typography>
}


function EffectShorthand({effect, gameModel: { gameModel }, children}) {
  const type = effect.type 
  const classes = gameModel.classes 
  const cutscenes = gameModel.cutscenes 
  const tags = gameModel.tags 

  function renderBody() {
    if(type === EFFECT_TELEPORT) {
      return <>
        {renderEffect(effect)}
        {/* {` to`}   */}
        {renderClass(classes[effect.zoneClassId])}
      </>
    }

    if(type === EFFECT_RECLASS) {
      return <>
        {renderEffect(effect)}
        {/* {` into`} */}
        {renderClass(classes[effect.classId])}
      </>
    }

    if(type === EFFECT_SPAWN) {
      return <>
        {renderEffect(effect)}
        {renderClass(classes[effect.spawnClassId])}
        {/* {'into'} */}
        {/* {renderClass(classes[effect.zoneClassId])} */}
      </>
    }

    if(type === EFFECT_CUTSCENE) {
      return <>
        {renderEffect(effect)}
        {`${cutscenes[effect.cutsceneId].name}`}
      </>
    }

    if(type === EFFECT_DESTROY) {
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
