import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ListItemButton, ListSubheader } from '@mui/material';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';

export default function NestedList({listItems}) {
  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return <NestedListBody expanded={expanded} onChange={handleChange}></NestedListBody>
}

export function NestedListBody({expanded, onChange, title, children, id, interfaceId}) {
    const el = <><ListItemButton onClick={onChange(id)}>
        <ListItemText primary={title} />
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={expanded === id} unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>

    if(interfaceId) {
      return <Unlockable key={id} interfaceId={interfaceId}>
        {el}
      </Unlockable>
    } else {
      return el
    }
}

export function NestedListContainer({children, title}) {
  return <List
    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
    aria-labelledby="nested-list-subheader"
    subheader={
      title ? <ListSubheader component="div" id="nested-list-subheader">
        {title}
      </ListSubheader> : null
    }
  >{children}</List>
}

export function NestedListItem({children, title, onClick}) {
    console.log(title, onClick)

  return <ListItemButton onClick={onClick} sx={{ pl: 4 }}>
    {title && <ListItemText primary={title} />}
    {children}
  </ListItemButton>
}
