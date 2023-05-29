import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './NameForm.scss';
import Typography from '../../../ui/Typography/Typography';
import IconButton from '../../../ui/IconButton/IconButton';
import Alert from '../../../ui/Alert/Alert';
import TextField from '../../../ui/TextField/TextField';
import Dialog from '../../../ui/Dialog/Dialog';
import Button from '../../../ui/Button/Button';

const NameForm = ({ initialName, onUpdateName, onUpdateError, error, nameList, name }) => {
  const [ignoreName] = useState(initialName)
  const [isEditingName, setIsEditingName] = useState(null)

  useEffect(() => {
    if(ignoreName && name === ignoreName) return
    testName(name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, ignoreName])

  function testName(name) {
    if(!name || !name.length) {
      onUpdateError('Name must not be empty')
      return false
    }
    
    if(ignoreName && name === ignoreName) return true
    if(nameList.indexOf(name) >= 0) {
      onUpdateError('That name is already in use')
      return false
    }

    onUpdateError(null)
    return true
  }

  function handleChange(e) {
    const newVal = e.target.value

    onUpdateError(null)
    onUpdateName(newVal)
  }
  
  function renderNameDisplay() {
    return <div
      className="NameForm"
      // onMouseEnter={() => {
      //   setIsHovering(true)
      // }}
      // onMouseLeave={() => {
      //   setIsHovering(false)
      // }}
    >
      <Typography variant="h5">
        {name}
      </Typography>
      <Button icon="faPen" size="small" color="primary" onClick={() => {
        setIsEditingName(name)
      }}>Edit Name</Button>
    </div>
  }

  return <>
    {renderNameDisplay()}
    {isEditingName && <Dialog open>
      <div className="NameForm NameForm--editing">
        <TextField onChange={handleChange} label="Name" value={name} />
        {error && <Alert severity="error">{error}</Alert>}
          <Button disabled={error} onClick={() => {
            setIsEditingName(null)
        }}>Save</Button>
        <Button onClick={() => {
          onUpdateName(isEditingName)
          onUpdateError(null)
          setIsEditingName(null)
        }}>Cancel</Button>
      </div>
    </Dialog>}
  </>
};

const mapStateToProps = (state) =>({


});

export default connect(mapStateToProps, { })(NameForm);
