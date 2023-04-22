import { Paper } from "@mui/material";
import { activityViewToInterfaceData } from "../../../../constants";
import Icon from "../../../../ui/Icon/Icon";

export default function ViewChip({viewCategory}) {
  const interfaceData = activityViewToInterfaceData[viewCategory]
  return <Paper elevation={1} sx={{
    width: 'max-content',
    padding: '.4em',
    backgroundColor: '#333',
  }}>
    <Icon icon={interfaceData.icon}/>
    {'     ' + interfaceData.displayName}
  </Paper>
}