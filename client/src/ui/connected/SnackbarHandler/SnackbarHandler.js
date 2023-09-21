import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './SnackbarHandler.scss';

import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { Snackbar, SnackbarContent } from '@mui/material';
import { clearSnackbar } from '../../../store/actions/snackbarActions';
import IconButton from '../../IconButton/IconButton';

const SnackbarHandler= ({ 
  snackbar: { snackbars },
  clearSnackbar
 }) => {  
  const [currentSnackbar, setCurrentSnackbar] = useState()

  useEffect(() => {
    if(snackbars.length > 0) {
      console.log("snackbars", snackbars)
      setCurrentSnackbar(snackbars[snackbars.length-1])
    }
  }, [snackbars])

  function renderSnackbar() {
    function handleClose() {
      clearSnackbar(currentSnackbar.id)
    }

    if(!currentSnackbar) return null

    const action = (<>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
        icon="faClose"
      ></IconButton>
    </>)

    return <Snackbar
      open
      key={clearSnackbar.id}
      autoHideDuration={8000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      // onClose={handleClose}
      action={action}>
        <SnackbarContent 
          message={<div>
            {currentSnackbar.imageUrl && <img alt={currentSnackbar.message} src={currentSnackbar.imageUrl} width="100px"/>}
            {currentSnackbar.message}
            {action}
          </div>}
        />
    </Snackbar>
  }

  return <div className="SnackbarHandler">
    {snackbars.length > 0 && renderSnackbar()}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  snackbar: state.snackbar
});

export default connect(mapStateToProps, { clearSnackbar })(SnackbarHandler);
