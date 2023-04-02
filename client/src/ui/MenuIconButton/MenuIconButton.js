import * as React from 'react';
import Menu from '@mui/material/Menu';
import { IconButton } from '@mui/material';
import './MenuIconButton.scss'

export default function MenuIconButton({ icon, menu }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false)
  };

  return <MenuIconButtonBody onOpen={handleOpen} onClose={handleClose} icon={icon} menu={menu} open={open}/>;
}

export function MenuIconButtonBody({ icon, menu, open, onOpen, onClose }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const target = React.useRef()
  const handleClick = (event) => {
    onOpen(true)
  };
  const handleClose = () => {
    onClose(false)
  };

  React.useEffect(() => {
    if(open) {
      setAnchorEl(target.current);
    } else {
      setAnchorEl(null);
    }
  }, [open])

  return (
    <>
      <IconButton
        id="basic-button"
        ref={target}
        aria-controls={open && anchorEl  ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open && anchorEl  ? 'true' : undefined}
        onClick={handleClick}
        sx={{ padding: 0}}
      >
        {icon}
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open && anchorEl }
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menu(handleClose)}
      </Menu>
    </>
  );
}