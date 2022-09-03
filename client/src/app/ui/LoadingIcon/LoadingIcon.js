import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

import './LoadingIcon.scss';

const LoadingIcon = ({size, color}) => {
  return <FontAwesomeIcon icon={faCircleNotch} size={size} color={color} spin/>
}

export default LoadingIcon