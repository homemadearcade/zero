import { Paper } from "@mui/material"
import Icon from "../../../ui/Icon/Icon"
import './RelationTagChip.scss'
import Texture from "../../textures/Texture/Texture"
import Typography from "../../../ui/Typography/Typography"

function renderTexture(relationTag) {
  if(relationTag.icon) {
    return <Icon className="RelationTagChip__icon" color={relationTag.textureTint} icon={relationTag.icon}/>
  }

  if(relationTag.textureId || relationTag.textureTint) {
    return <div className="RelationTagChip__texture">
      <Texture textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
      </div>
  }
  
  if(relationTag.color) {
    return <div className="RelationTagChip__color" style={{backgroundColor: relationTag.color}}/>
  }
}

export function RelationTagChip  ({ relationTag, iconOnly, className, suffix ="" }) {
  return <Paper elevation={3} sx={{
    width: 'max-content',
    padding: '.4em',
  }} className={className}>
    <div className="RelationTagChip">
      {renderTexture(relationTag)}
      {!iconOnly && relationTag.name + suffix}
      {relationTag.description && <Typography variant='subtitle2' className='EntityModelCutscenes__relation-description'>{relationTag.description}</Typography>}
    </div>
  </Paper>
}

