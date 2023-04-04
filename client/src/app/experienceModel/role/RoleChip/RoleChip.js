import { roleToInterfaceData } from "../../../../constants"
import Icon from "../../../../ui/Icon/Icon"
import './RoleChip.scss'
export function RoleChip  ({ role, className, suffix ="" }) {
  return <div className={className}>
    <Icon className="RoleChip__icon" color={role.color} icon={roleToInterfaceData[role.roleCategory].icon}/>
    {role.name + suffix}
  </div>
}