import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';

function Row(props) {
  const { row, mini } = props;

  return (
    <React.Fragment>
     <TableRow
        key={row.date}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        {!mini && <TableCell component="th" scope="row">
          {moment(row.date).format('MMMM Do YYYY, H:mm:ss')}
        </TableCell>}
        {!mini && <TableCell align="right" sx={{wordBreak: 'break-all', width: '100px'}}>{row.url}</TableCell>}
        <TableCell align="right">{row.uploadSpeed}</TableCell>
        <TableCell align="right">{row.downloadSpeed}</TableCell>
        {!mini && <TableCell align="right">{row.browserName}</TableCell>}
        {!mini && <TableCell align="right">{row.osName}</TableCell>}
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    url: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    browserName: PropTypes.string.isRequired,
    osName: PropTypes.string.isRequired,
    // uploadSpeed: PropTypes.number.isRequired,
    // downloadSpeed: PropTypes.number.isRequired,
  }).isRequired,
};

export default function SpeedTestTable({rows, mini}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="table">
        <TableHead>
          <TableRow>
            {!mini && <TableCell>Date</TableCell>}
            {!mini && <TableCell>Url</TableCell>}
            <TableCell>Upload Speed</TableCell>
            <TableCell>Download Speed</TableCell>
            {!mini && <TableCell>Browser</TableCell>}
            {!mini && <TableCell>System</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.date} row={row} mini={mini} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
