/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EventDatePicker.scss';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import EventDateList from '../EventDateList/EventDateList';

{/* <Typography variant="subtitle1">Starting at $100</Typography> */}

const EventDatePicker = ({
  ticketedEvent: { ticketedEvent: { dates, title, location }},
  onClickTicket
}) => {
  return (
    <div className="EventDatePicker">
      <EventDateList
        dates={dates.filter((date) => {
          if(!date.startDate) return false    
          if((new Date(date.startDate).getTime() - new Date().getTime()) < 0) {
            return false
          }
          return true
        })}
        renderDetails={() => {
          return <>
              <Typography variant="subtitle2">{title}</Typography>
              <Typography variant="subtitle1">{location}</Typography>
            </>
        }}
        renderCallToActionSection={(dateId, isSoldOut) => {
          return <>
            <Button disabled={isSoldOut} variant="contained" onClick={() => {
              onClickTicket(dateId)
            }}>Tickets</Button>
            </>
        }}
        ></EventDateList>      
    </div>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent
});

export default compose(
  connect(mapStateToProps, { }),
)(EventDatePicker);
