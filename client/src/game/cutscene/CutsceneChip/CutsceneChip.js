import { Paper } from "@mui/material"
import Icon from "../../../ui/Icon/Icon"
import './CutsceneChip.scss'
import Texture from "../../textures/Texture/Texture"
import Typography from "../../../ui/Typography/Typography"
import { compose } from "redux"
import { connect } from "react-redux"

function renderTexture(relationTag) {
  if(relationTag.icon) {
    return <Icon className="CutsceneChip__icon" color={relationTag.textureTint} icon={relationTag.icon}/>
  }

  if(relationTag.textureId || relationTag.textureTint) {
    return <div className="CutsceneChip__texture">
      <Texture textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
      </div>
  }
  
  if(relationTag.color) {
    return <div className="CutsceneChip__color" style={{backgroundColor: relationTag.color}}/>
  }
}

function renderScene(scene, gameModel) {
  if(scene.imageUrl) {
    return <img style={{width: '.8em', height: '.8em'}} src={scene.imageUrl} alt={scene.text}/>
  } else if(scene.entityModelId) {
    const entityModel = gameModel.entityModels[scene.entityModelId]
    return <div style={{width: '.8em', height: '.8em'}}>
      <Texture textureId={entityModel.graphics.textureId} textureTint={entityModel.graphics.textureTint}/>
    </div>
  }

  return <Icon icon="faScroll"/>
}

function CutsceneChip ({ cutscene, className, gameModel: { gameModel } }) {
  return <Paper elevation={3} sx={{
    width: 'max-content',
    padding: '.4em',
  }} className={className}>
    <div className="CutsceneChip">
      {cutscene.name}
      <Typography variant='subtitle2' className='EntityModelCutscenes__relation-description'>{cutscene.scenes.length + ' scenes'}</Typography>
      {cutscene.scenes.map((scene, index) => {
        return <div key={index} className="CutsceneChip__scene">{renderScene(scene, gameModel)}</div>
      })}
    </div>
  </Paper>
}

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default compose(
  connect(mapStateToProps, {  }),
)(CutsceneChip)