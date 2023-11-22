import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import Button from '../../../ui/Button/Button';


function Row(props) {
  const { row } = props;

  return (
    <React.Fragment>
     <TableRow
        key={row.entityModelId}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
         <TableCell component="th" scope="row">
          {moment(row.date).format('MMMM Do YYYY, H:mm:ss')}
        </TableCell>
         <TableCell align="right" sx={{wordBreak: 'break-all', width: '100px'}}>{row.name}</TableCell>
        <TableCell align="right">{row.entityModelId}</TableCell>
        <TableCell align="right">
          <Button>
            Open Entity Model
          </Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const GameImportantEntityModelIds = ({ 
  gameModel: { gameModel }
}) => {
  const rows = gameModel.importantValues

  return (
    <TableContainer component={Paper}>
      <Table aria-label="table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>EntityModelId</TableCell>
            <TableCell>
  
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.entityModelId} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const mapStateToProps = (state) => ({
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { })(GameImportantEntityModelIds);
