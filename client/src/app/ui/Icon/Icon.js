import { faPowerOff, faPlay, faPause, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { faMicrophone, faMicrophoneSlash, faGear, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faWarning, faEraser, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEye, faCrown, faArrowPointer, faDownload, faUpload, faWindowMaximize } from '@fortawesome/free-solid-svg-icons'
import { faBars, faHammer, faEyeDropper } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash, faPlus, faMask, faHouseLaptop, faStop, faRotateLeft, faDesktop, faQuestionCircle, faQuestion, faLock, faLockOpen, faTableCells } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconMap = {
  faEyeDropper,
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
  faLockOpen,
  faMask,
  faDesktop,
  faStop,
  faRotateLeft,
  faHouseLaptop,
  faPlus,
}

const Icon = (props) => {
  const { icon, size, color, onClick } = props

  if(!iconMap[icon]) {
    console.error(icon)
  }

  return <FontAwesomeIcon {...props} icon={iconMap[icon]} onClick={onClick} size={size} color={color} />
}

export default Icon