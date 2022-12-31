import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './TicketedEventCalendarPage.scss';

import Layout from '../../layout/Layout';
import Typography from '../../ui/Typography/Typography';

import { getTicketedEvents, editTicketedEvent } from '../../store/actions/ticketedEventActions';
import ProjectHeader from '../../app/wishLabs/ProjectHeader/ProjectHeader';
import Loader from '../../ui/Loader/Loader';
import AddEventDateForm from '../../ticketing/AddEventDateForm/AddEventDateForm';

const TicketedEventCalendarPage = ({ getTicketedEvents, editTicketedEvent, ticketedEvent: { ticketedEvents, isLoading }, auth: { me }}) => {
  useEffect(() => {
    getTicketedEvents();
  }, [getTicketedEvents]);

  let homemadeArcadeEvent = ticketedEvents[0]

  return (
    <Layout>
      <div className="TicketedEventCalendarPage">
        <Typography component="h1" variant="h1">Calendar page</Typography>
          This is the Calendar page. Here are listed all of the dates for the event. 
      {(isLoading || ticketedEvents.length === 0) ? (
            <Loader />
      ) : (<><div className="TicketedEventCalendarPage__event">
          <ProjectHeader title={homemadeArcadeEvent.title} subtitle={homemadeArcadeEvent.subtitle}></ProjectHeader>
        </div>
        <div className="TicketedEventCalendarPage__calendar">
          <AddEventDateForm></AddEventDateForm>
        </div></>)}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { getTicketedEvents, editTicketedEvent }))(TicketedEventCalendarPage);
