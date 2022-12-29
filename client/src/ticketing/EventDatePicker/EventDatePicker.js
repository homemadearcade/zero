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
          <div className="EventDatePicker__body">
            <div className="EventDatePicker__calendar-date">
              <div className="EventDatePicker__calendar-date-month">
                {month.substr(0,3)}
              </div>
              <div className="EventDatePicker__calendar-date-day">
                {day}
              </div>
            </div>
            <div className="EventDatePicker__details">
              <Typography variant="h4">{time}</Typography>
              <Typography variant="subtitle2">{title}</Typography>
              <Typography variant="subtitle1">{location}</Typography>
            </div>
          </div>
          <div className="EventDatePicker__tickets">
            <Button variant="contained" onClick={() => {
              onClickTicket(id)
            }}>Tickets</Button>
            <Typography variant="subtitle1">Starting at $100</Typography>
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
