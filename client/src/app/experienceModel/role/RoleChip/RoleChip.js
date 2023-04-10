import { Paper } from "@mui/material"
import { roleToInterfaceData } from "../../../../constants"
import Icon from "../../../../ui/Icon/Icon"
import './RoleChip.scss'
export function RoleChip  ({ role, className, suffix ="" }) {
  return <Paper elevation={1} sx={{
    width: 'max-content',
    padding: '.4em',
    backgroundColor: '#333',
  }} className={className}>
    <Icon className="RoleChip__icon" color={role.color} icon={roleToInterfaceData[role.roleCategory].icon}/>
    {role.name + suffix}
  </Paper>
}