import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';

import './HATicketsPage.scss';
import { playBackgroundMusic } from '../../store/actions/portfolioActions';
import ProjectHeader from '../../app/wishLabs/ProjectHeader/ProjectHeader';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import { Container } from '@mui/system';
import { Dialog, IconButton } from '@mui/material';
import EventDatePicker from '../../ticketing/EventDatePicker/EventDatePicker';
import TicketTypePicker from '../../ticketing/TicketTypePicker/TicketTypePicker';

const HATicketsPage = () => {
  let [isDatePickerOpen, setIsDatePickerOpen] = useState()
  let [isTicketPickerOpen, setIsTicketPickerOpen] = useState()
  let [ticketsInCart, setTicketsInCart] = useState({})

  function handleDialogClose() {
    setTimeout(() => {
      setIsTicketPickerOpen(false)
      setTicketsInCart({})
    }, 200)
    setIsDatePickerOpen(false)
  }

  const ticketedEvent = {
    dates: [{
      month: 'July',
      day: '13',
      year: '2023',
      id: 'july132023'
    }, {
      month: 'June',
      day: '20',
      year: '2023',
      id: 'june202023'
    }],
    tickets: [{
      id: 'genadmin',
      title: 'general admission',
      price: '100'
    }]
  }

  return <div className="HATicketsPage">
    <ProjectHeader
      title="Homemade Arcade" 
      subtitle="An arcade game creation experience"
      logoSrc=""
    />
    <Container>
      <div className="HATicketsPage__content">
        <div className="HATicketsPage__info">
          <div className="HATicketsPage__authors">
            <Typography variant="h5">By Spencer Williams and Jon Pedigo</Typography>
          </div>
          <div className="HATicketsPage__summary">
            In this two hour experience you will create your own arcade game, guided by a sentient and sentimental AI. Spencer Williams has an award winning history of building collaborative creative experiences such as Tales by Candlelight. Jon Pedigo is the co-creator of Bar of Dreams, a beloved intimate immersive theater production about a kid who played too many video games. He is a software engineer and spent the pandemic building a custom game engine to allow this experience to exist.
          </div>
          <Typography variant="h5">When and Where</Typography>
          <div className="HATicketsPage__logistics">
            <div className="HATicketsPage__dates">
              <div className="HATicketsPage__logistics-icon">
                <Icon color="white" icon="faCalendar"></Icon>
              </div>
              <div className="HATicketsPage__logistics-text">
                <Typography variant="subtitle1">Date and Time</Typography>
                16 nights in February, 7pm - 9pm
              </div>
            </div>
            <div className="HATicketsPage__location">
              <div className="HATicketsPage__logistics-icon">
                <Icon color="white" icon="faLocationDot"></Icon>
              </div>
              <div className="HATicketsPage__logistics-text">
                <Typography variant="subtitle1">Location</Typography>
                Online at your home with a good internet connection and on your computer that has a webcam and Google Chrome installed
              </div>
            </div>
          </div>
        </div>
        <div className="HATicketsPage__purchase">
          <Typography font="2P" variant="h5">$100</Typography>
          <Button onClick={() => {
            setIsDatePickerOpen(true)
          }} color="primary" size="large" variant="contained" fullWidth><Icon color="white" icon="faCalendar"></Icon>
          <div className="HATicketsPage__purchase-button">Select a Date</div></Button>
        </div>
      </div>
    </Container>
    <Dialog maxWidth={false} open={isDatePickerOpen} onClose={() => {
      handleDialogClose()
    }}>
      <div className="PurchaseDialog">
        <div className="PurchaseDialog__close">
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              handleDialogClose()
            }}
            aria-label="close"
          >
            <Icon icon="faClose"></Icon>
          </IconButton>
        </div>

        <div className='PurchaseDialog__picker'>
          {!isTicketPickerOpen && <EventDatePicker 
            onClickTicket={(id) => {
              setIsTicketPickerOpen(id)
            }}
            dates={
              ticketedEvent.dates
            }
          />}
          {isTicketPickerOpen && <TicketTypePicker 
            ticketsInCart={ticketsInCart}
            tickets={ticketedEvent.tickets}
            onChangeTicketAmount={(id, amount) => {
              setTicketsInCart({
                ...ticketsInCart,
                [id] : amount
              })
            }}
          />}
        </div>
        <div className='PurchaseDialog__results'>
          <ProjectHeader
            title="Homemade Arcade" 
            subtitle="An arcade game creation experience"
            logoSrc=""
          />
        </div>
      </div>
    </Dialog>
  </div>

};

const mapStateToProps = (state) => ({});

export default compose(
  connect(mapStateToProps, { playBackgroundMusic }))(HATicketsPage);
