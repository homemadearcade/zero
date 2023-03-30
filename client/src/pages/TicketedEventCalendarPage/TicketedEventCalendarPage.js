import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './TicketedEventCalendarPage.scss';

import Layout from '../../layout/Layout';
import Typography from '../../ui/Typography/Typography';

import { getTicketedEvents, editTicketedEvent } from '../../store/actions/ticketing/ticketedEventActions';
import ProjectHeader from '../../marketing/wishLabs/ProjectHeader/ProjectHeader';
import Loader from '../../ui/Loader/Loader';
import AddEventDateForm from '../../ticketing/AddEventDateForm/AddEventDateForm';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';
import EventDateList from '../../ticketing/EventDateList/EventDateList';

import dayjs from 'dayjs'
import Select from '../../ui/Select/Select';
import Button from '../../ui/Button/Button';
import PageHeader from '../../ui/PageHeader/PageHeader';

          // renderCallToActionSection={(id) => {
            
          // }}
const TicketedEventCalendarPage = ({ getTicketedEvents, editTicketedEvent, ticketedEvent: { ticketedEvent, isLoading }, auth: { me }}) => {
  useEffect(() => {
    getTicketedEvents();
  }, []);

  const [sortingBy, setSortingBy] = useState('upcoming')

  return (
    <Layout>
      <div className="TicketedEventCalendarPage">
        <PageHeader
          title="Calendar page"
          description="This is the Calendar page. Here are listed all of the dates for the event."
        ></PageHeader>
        {(isLoading || !ticketedEvent) ? (<Loader />) : (<>
          <div className="TicketedEventCalendarPage__event">
            <ProjectHeader title={ticketedEvent.title} subtitle={ticketedEvent.subtitle}></ProjectHeader>
          </div>
          <div className="TicketedEventCalendarPage__dates">
            <Select inputLabel="Sort Dates By" options={['upcoming', 'expired', 'all'].map((s) => {
              return {value: s, label: s}
            })} onChange={(e) => {
              setSortingBy(e.target.value)
            }} value={sortingBy}></Select>
            <EventDateList
              event={ticketedEvent}
              dates={ticketedEvent.dates.filter((date) => {
                if(!date.startDate) return false

                const now =  dayjs(Date.now())
                const ticketDate = dayjs(date.startDate)

                const diff = now.diff(ticketDate)
                
                if(sortingBy === 'upcoming') {
                  if(diff > 0) {
                    return false
                  }
                  return true
                }
        
                if(sortingBy === 'expired') {
                  if(diff < 0) {
                    return false
                  }
                  return true
                }

                // if(sortingBy === 'unsold') {
                //   return true
                // }

                if(sortingBy === 'all') {
                  return true
                }

              })}
              renderDetails={(id, isSoldOut) => {
                return <>
                  {isSoldOut && <Typography color="red" variant="h5">Ticket sold!</Typography>}
                </>
              }}
              renderCallToActionSection={(dateId, isSoldOut) => {
                if(isSoldOut) return 

                return <Button onClick={() => {
                  const index = ticketedEvent.dates.findIndex(({id}) => {
                    return id === dateId
                  })
                  ticketedEvent.dates.splice(index, 1)
                  editTicketedEvent(ticketedEvent.id, ticketedEvent)
                }}>
                  Delete
                </Button>
              }} 
            ></EventDateList>
          </div>
          <div className="TicketedEventCalendarPage__calendar">
            <AddEventDateForm></AddEventDateForm>
          </div>
        </>)}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent,
  auth: state.auth
});

export default compose(
  requireAuth,
  requireAdmin,  
  connect(mapStateToProps, { getTicketedEvents, editTicketedEvent }))(TicketedEventCalendarPage);
