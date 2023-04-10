import { Paper } from "@mui/material";
import { activityToInterfaceData } from "../../../../constants";
import Icon from "../../../../ui/Icon/Icon";

export default function ActivityChip({activity}) {
  return <Paper elevation={1} sx={{
    width: 'max-content',
    padding: '.4em',
    backgroundColor: '#333',
  }}>
    <Icon icon={activityToInterfaceData[activity.activityCategory].icon}/>
    {'     ' + activity.name}
  </Paper>
}