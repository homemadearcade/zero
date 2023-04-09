import { faPowerOff, faPlay, faPause, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { faMicrophone, faMicrophoneSlash, faGear, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons'
import { faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faWarning, faEraser, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faEye, faShuffle, faFont, faUsers, faCrown, faArrowPointer, faChevronDown, faDownload, faUpload, faWindowMaximize } from '@fortawesome/free-solid-svg-icons'
import { faBars, faBurst, faChessPawn, faSkullCrossbones, faCircleXmark, faIcons, faMapLocation, faCameraRotate, faHammer, faCircleQuestion, faEyeDropper } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash, fa1, faTableCellsLarge, faBullhorn, faTerminal, faAward, faRightLeft, faBullseye, faLink, faUpLong, faScroll, faRobot, faArrowsDownToLine, faPersonBooth, faBoxArchive, faTrash, faBookAtlas, faBookBookmark, faWandMagicSparkles, faEllipsis, faCircle, faHourglassEnd, faComments, faHourglassStart, faPaintbrush, faGamepad, faDoorOpen, faListOl, faImage, faCameraRetro, faPen, faTableList, faTriangleExclamation, faRepeat, faCompress, faExpand, faCrosshairs, faHandPointer, faFolderOpen, faFloppyDisk, faPenToSquare, faUserSecret, faUserLock, faUser, faCirclePlay, faArrowLeft, faLocationDot, faMusic, faStar, faCalendar, faPlus, faVolumeHigh, faVolumeXmark, faMask, faHouseLaptop, faStop, faRotateLeft, faDesktop, faQuestionCircle, faQuestion, faLock, faLockOpen, faTableCells } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
 
const iconMap = {
  fa1,
  faTableCellsLarge,
  faBullhorn,
  faFont,
  faTerminal,
  faBurst,
  faSkullCrossbones,
  faAward,
  faBullseye,
  faLink,
  faUpLong,
  faCircleXmark,
  faRightLeft,
  faScroll,
  faRobot,
  faArrowsDownToLine,
  faPersonBooth,
  faBoxArchive,
  faTrash,
  faBookAtlas,
  faBookBookmark,
  faShuffle,
  faWandMagicSparkles,
  faChessPawn,
  faIcons,
  faMapLocation,
  faEllipsis,
  faCircle,
  faHourglassEnd,
  faHourglassStart,
  faPaintbrush,
  faGamepad,
  faComments,
  faDoorOpen,
  faListOl,
  faImage,
  faArrowPointer,
  faPen,
  faTableList,
  faCameraRetro,
  faRepeat,
  faCameraRotate,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faCrosshairs,
  faTriangleExclamation,
  faCompress,
  faExpand,
  faCircleQuestion,
  faHandPointer,
  faFolderOpen,
  faFloppyDisk,
  faPenToSquare,
  faUsers,
  faUserSecret,
  faUserLock,
  faUser,
  faGoogle,
  faCalendar,
  faChevronDown,
  faEyeDropper,
  faTableCells,
  faClose,
  faWarning,
  faEraser,
  faCheck,
  faEye,
  faEyeSlash,
  faCrown,
  faDownload,
  faUpload,
  faWindowMaximize,
  faBars,
  faPowerOff,
  faCirclePlay,
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
  faStar,
  faVolumeXmark,
  faMusic,
  faVolumeHigh,
  faLocationDot,
}

const Icon = (props) => {
  const { icon, size, color, onClick } = props

  if(!iconMap[icon]) {
    console.error(icon)
  }

  return <FontAwesomeIcon {...props} icon={iconMap[icon]} onClick={onClick} size={size} color={color} />
}

export default Icon