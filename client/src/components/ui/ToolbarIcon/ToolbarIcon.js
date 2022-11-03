import Icon from "../Icon/Icon";

import './ToolbarIcon.scss';

const ToolbarIcon = ({icon, size, color, onClick, className}) => {
  return <span className="ToolbarIcon">
    <Icon className={className} icon={icon} onClick={onClick} size={size} color={color} />
  </span>
}

export default ToolbarIcon