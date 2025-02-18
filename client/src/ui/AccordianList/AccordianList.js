import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';
import MenuIconButton from '../MenuIconButton/MenuIconButton';
import Icon from '../Icon/Icon';
import './AccordianList.scss'
import { SELECTOR_MORE_IID } from '../../constants/interfaceIds';
import CobrowsingMenuIconButton from '../../game/cobrowsing/CobrowsingMenuIconButton/CobrowsingMenuIconButton';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  height: 'auto',
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9em' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  // padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function AccordianList({accordians, initialExpandedId = null}) {
  const [expanded, setExpanded] = useState(initialExpandedId);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return <AccordionListBody accordianList={accordians} expanded={expanded} onChange={handleChange}/>
}

export function AccordionListBody({expanded, onChange, accordianList}) {
  function renderSummary({title, moreMenu, moreMenuInterfaceId}) {
    const summaryEl = <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
      {moreMenu && <Unlockable className="AccordianList__more-menu-icon" interfaceId={SELECTOR_MORE_IID}><div onClick={(e) => {
          e.stopPropagation()
       }}>
        {moreMenuInterfaceId ? <CobrowsingMenuIconButton
          icon={<Icon size="xs" icon="faEllipsis"/>}
          interfaceId={moreMenuInterfaceId}
          interfaceIdGroup={SELECTOR_MORE_IID}
          menu={(onClose) => {
            return moreMenu
          }}
        ></CobrowsingMenuIconButton>
        : <MenuIconButton 
          icon={<Icon size="xs" icon="faEllipsis"/>}
          menu={(onClose) => {
            return moreMenu
          }}
        />}
      </div>
      </Unlockable>
    }
      {title}
    </AccordionSummary>

    return summaryEl
  }

  function renderBody({body}) {
    const bodyEl = <AccordionDetails>{body}</AccordionDetails>

    return bodyEl
  }

  function renderAccordian({title, body, interfaceId, moreMenu, moreMenuInterfaceId, sx}) {
    const el = <Accordion sx={sx} key={interfaceId} expanded={expanded === interfaceId} onChange={onChange(interfaceId)}>
      {renderSummary({title, interfaceId, moreMenu, moreMenuInterfaceId})}
      {renderBody({body, interfaceId})}
    </Accordion>
    if(interfaceId) {
      return <Unlockable key={interfaceId} interfaceId={interfaceId}>
        {el}
      </Unlockable>
    } else {
      return el
    }
  }

  return (
    <div className="Accordian">
      {accordianList.filter((item) => !!item).map((props) => {
        return renderAccordian(props)
      })}
    </div>
  );
}