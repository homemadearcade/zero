import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { ListItemButton, ListItemIcon, ListSubheader } from '@mui/material';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';
import MenuIconButton from '../MenuIconButton/MenuIconButton';
import Icon from '../Icon/Icon';
import './NestedList.scss'
import { SELECTOR_MORE_IID } from '../../constants/interfaceIds';
import Texture from '../../game/textures/Texture/Texture';

export default function NestedList({ children, onClick, title, interfaceId, moreMenu}) {
  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (interfaceId) => (event) => {
    setExpanded(expanded === interfaceId ? null : interfaceId);
  };

  return <NestedListBody onClick={onClick} title={title} interfaceId={interfaceId} children={children} expanded={expanded} onChange={handleChange} moreMenu={moreMenu}/>
}

export function NestedListBody({expanded, onChange, title, obscureInterfaceIds, children, interfaceId, moreMenu}) {
    const isOpen = expanded === interfaceId
    const el = <><ListItemButton  onClick={onChange(interfaceId)}>
      {isOpen ? <ExpandMore  sx={{ fontSize: '1.5' }} /> : <ChevronRight  sx={{ fontSize: '1.5' }} />}
      <ListItemText primaryTypographyProps={{
          variant:"subtitle2", 
          sx:{
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
            fontWeight: 400,
            fontSize: '1em',
            lineHeight: 1.75,
            letterSpacing: '0.00938em'
          }
      }} primary={title} />
       {moreMenu && <Unlockable className="NestedList__more-menu-icon" interfaceId={SELECTOR_MORE_IID}>
          <div onClick={(e) => {
            e.stopPropagation()
        }}>
          <MenuIconButton 
            icon={<Icon size="xs" icon="faEllipsis"/>}
            menu={(onClose) => {
              return moreMenu
            }}
          />
        </div>
      </Unlockable>}
      </ListItemButton>
      <Collapse in={isOpen} unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>

    if(obscureInterfaceIds) {
      return <Unlockable key={interfaceId} interfaceId={interfaceId}>
        {el}
      </Unlockable>
    } else {
      return el
    }
}

export function NestedListContainer({children, title}) {
  return <List
    sx={{ width: '100%', bgcolor: 'background.paper' }}
    aria-labelledby="nested-list-subheader"
    subheader={
      title ? <ListSubheader component="div" id="nested-list-subheader">
        {title}
      </ListSubheader> : null
    }
  >{children}</List>
}

function TextureSquare({textureId, textureTint}) {
  return  <span style={{
          justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    width: '.6em', height: '.6em'}}>
      <Texture textureId={textureId} textureTint={textureTint}/>
    </span>
}

  // if(!color) {
  //   return <ListItemIcon><div style={{width: '.5em', height:'.5em', border: '1px solid white'}}/></ListItemIcon> 
  // } else {
  //   return <ListItemIcon><div style={{width: '.5em', height:'.5em', backgroundColor: color}}/></ListItemIcon> 
  // }
export function NestedListItem({children, title, onClick, textureId, textureTint, useTexture}) {
  return <ListItemButton dense onClick={onClick} sx={{ pl: '2em' }}>
    {useTexture && <TextureSquare textureId={textureId} textureTint={textureTint}></TextureSquare>}
    {title && <ListItemText primary={title} />}
    {children}
  </ListItemButton>
}

export function NestedListItemButton({children, title, onClick, useTexture, textureId, textureTint}) {
  return <ListItem dense onClick={onClick} sx={{ pl: '2em' }}>
    {useTexture && <TextureSquare textureId={textureId} textureTint={textureTint}></TextureSquare>}
    {title && <ListItemText primary={title} />}
    {children}
  </ListItem>
}
