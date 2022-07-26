import { faPowerOff, faPlay, faPause, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { faMicrophone, faMicrophoneSlash, faGear, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faWarning, faEraser, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEye, faCrown, faArrowPointer, faDownload, faUpload, faWindowMaximize } from '@fortawesome/free-solid-svg-icons'
import { faBars, faHammer } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash, faQuestionCircle, faQuestion, faLock, faLockOpen, faTableCells } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconMap = {
  faArrowDown,
  faTableCells,
  faArrowUp,
  faClose,
  faWarning,
  faEraser,
  faCheck,
  faEye,
  faEyeSlash,
  faArrowPointer,
  faCrown,
  faDownload,
  faUpload,
  faWindowMaximize,
  faBars,
  faPowerOff,
  faPause,
  faPlay,
  faRotateRight,
  faMicrophone,
  faMicrophoneSlash,
  faGear,
  faVideo,
  faVideoSlash,
  faHammer,
  faQuestionCircle,
  faQuestion,
  faLock,
  faLockOpen
}

const Icon = ({icon, size, color, onClick}) => {
  return <FontAwesomeIcon icon={iconMap[icon]} onClick={onClick} size={size} color={color} />
}

export default Icon