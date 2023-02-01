import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
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

  function renderSummary({title, interfaceId}) {

    const summaryEl = <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
      {title}
    </AccordionSummary>

    if(interfaceId) {
      return <Unlockable hideLockToggle interfaceId={interfaceId}>
        {summaryEl}
      </Unlockable>
    } else {
      return summaryEl
    }
  }

  function renderBody({body, interfaceId}) {
    const bodyEl = <AccordionDetails>{body}</AccordionDetails>

    if(interfaceId) {
      return <Unlockable interfaceId={interfaceId}>
        {bodyEl}
      </Unlockable>
    } else {
      return bodyEl
    }
  }

  return (
    <div className="Accordian">
      {accordianList.filter((item) => !!item).map(({id, title, body, interfaceId, lockBody}) => {
        return <Accordion key={id} expanded={expanded === id} onChange={onChange(id)}>
          {renderSummary({title, interfaceId})}
          {renderBody({body, interfaceId, lockBody})}
        </Accordion>
      })}
    </div>
  );
}