/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EventDatePicker.scss';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';

const EventDatePicker = ({
  title,
  location, 
  dates,
  onClickTicket
}) => {
  return (
    <div className="EventDatePicker">
      {dates.map(({id, month, day, time}) => {

        return <div className="EventDatePicker__date">
          <div className="EventDatePicker__calendar-date">
            <div className="EventDatePicker__calendar-date-month">
              {month}
            </div>
            <div className="EventDatePicker__calendar-date-day">
              {day}
            </div>
          </div>
          <div className="EventDatePicker__body">
            <Typography variant="h3">{time}</Typography>
            <Typography variant="subtitle1">{title}</Typography>
            <Typography variant="h5">{location}</Typography>
          </div>
          <div className="EventDatePicker__tickets">
            <Button variant="contained" onClick={() => {
              onClickTicket(id)
            }}>Tickets</Button>
            <Typography variant="h5">Starting at $100</Typography>
          </div>
        </div>
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }),
)(EventDatePicker);
