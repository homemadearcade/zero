import Icon from "../Icon/Icon";

import './ToolbarIcon.scss';

const ToolbarIcon = ({icon, size, color, onClick}) => {
  return <span className="ToolbarIcon">
    <Icon icon={icon} onClick={onClick} size={size} color={color} />
  </span>
}

export default ToolbarIcon