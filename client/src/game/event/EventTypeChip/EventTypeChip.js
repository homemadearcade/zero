import { Paper } from "@mui/material"
import Icon from "../../../ui/Icon/Icon"
import './EventTypeChip.scss'
import Texture from "../../textures/Texture/Texture"
import { eventShortNames, eventTypeDescriptions, eventTypeInterfaces } from "../../constants"
import Typography from "../../../ui/Typography/Typography"

function renderTexture(relationTag) {
  if(relationTag.icon) {
    return <Icon className="EventChip__icon" color={relationTag.textureTint} icon={relationTag.icon}/>
  }

  if(relationTag.textureId || relationTag.textureTint) {
    return <div className="EventChip__texture">
      <Texture textureId={relationTag.textureId} textureTint={relationTag.textureTint}/>
      </div>
  }
  
  if(relationTag.color) {
    return <div className="EventChip__color" style={{backgroundColor: relationTag.color}}/>
  }
}

export function EventTypeChip  ({ eventType, className}) {
  const eventName = eventShortNames[eventType]
  const eventDescription = eventTypeDescriptions[eventType].this

  return <Paper elevation={3} sx={{
    width: 'max-content',
    padding: '.4em',
  }} className={className}>
    <div className="EventTypeChip">
      {/* {renderTexture(event)} */}
      <Typography className="EventTypeChip__name" sx={{
        fontWeight: '700',
      }} variant="h5">{eventName}</Typography>
      <div className="EventTypeChip__description">
        <Typography variant="subtitle2">{eventDescription}</Typography>
      </div>
    </div>
  </Paper>
}

