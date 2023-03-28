import { roleToInterfaceData } from "../../../../constants"
import Icon from "../../../../ui/Icon/Icon"
import './RoleChip.scss'
export function RoleChip  ({ role }) {
  return <div>
    <Icon className="RoleChip__icon" color={role.color} icon={roleToInterfaceData[role.roleCategory].icon}/>
    {role.name}
  </div>
}