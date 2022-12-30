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
import ScrollDialog from '../../ui/ScrollDialog/ScrollDialog';

const HATicketsPage = () => {
  let [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  let [isTicketPickerOpen, setIsTicketPickerOpen] = useState(false)
  let [ticketsInCart, setTicketsInCart] = useState({})

  function handleDialogClose() {
    setTimeout(() => {
      setIsTicketPickerOpen(false)
      setTicketsInCart({})
    }, 200)
    setIsDatePickerOpen(false)
  }

  const ticketedEvent = {
    title: 'Homemade Arcade',
    subtitle: 'An arcade game creation experience',
    location: 'Online',
    dates: [{
      month: 'July',
      day: '13',
      year: '2023',
      time: '8am-10am',
      id: 'july132023'
    }, {
      month: 'September',
      day: '11',
      year: '2023',
      time: '8am-10am',
      id: 'june202023'
    },
    {
      month: 'April',
      day: '24',
      year: '2023',
      time: '8am-10am',
      id: 'june202023'
    },
    {
      month: 'May',
      day: '4',
      year: '2023',
      time: '8am-10am',
      id: 'june202023'
    },
    {
      month: 'September',
      day: '13',
      year: '2023',
      time: '8am-10am',
      id: 'june202023'
    },
    {
      month: 'June',
      day: '20',
      year: '2023',
      time: '8am-10am',
      id: 'june202023'
    }],
    tickets: [{
      id: 'genadmin',
      title: 'general admission',
      price: '100'
    }]
  }

  const selectedDate = ticketedEvent.dates.filter(({ id }) => {
    return id === isTicketPickerOpen
  })[0]

  return <div className="HATicketsPage">
     <Container>
      <ProjectHeader
        title={ticketedEvent.title}
        subtitle={ticketedEvent.subtitle}
        logoSrc="/assets/images/homemadearcadelogo.png"
      />
   
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
    <ScrollDialog 
      title={<>
        <div className="PurchaseDialog__title">
          <Typography font="2P" variant="h5">{ticketedEvent.title}</Typography>
          {isTicketPickerOpen && <Typography variant="subtitle1">{selectedDate.month} {selectedDate.day} {selectedDate.time}</Typography>}
        </div>
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
        {isTicketPickerOpen && <div className="PurchaseDialog__return">
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              setIsTicketPickerOpen(null)
            }}
            aria-label="close"
          >
            <Icon icon="faArrowLeft"></Icon>
          </IconButton>
        </div>}
      </>}
      actions={<Button size="large" variant="contained" disabled={!(Object.keys(ticketsInCart).length)}>
        Checkout
      </Button>}
      maxWidth={false} 
      open={isDatePickerOpen} onClose={() => {
        handleDialogClose()
      }}>
      <div className="PurchaseDialog">
        <div className='PurchaseDialog__content'>
          <div className='PurchaseDialog__picker'>
            {!isTicketPickerOpen && <EventDatePicker 
              title={ticketedEvent.title}
              location={ticketedEvent.location}
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
              hideImage
              autoHeight
              title={ticketedEvent.title}
              subtitle={ticketedEvent.subtitle}
              logoSrc="/assets/images/homemadearcadelogo.png"
            />
          </div>
        </div>
      </div>
    </ScrollDialog>
  </div>

};

const mapStateToProps = (state) => ({});

export default compose(
  connect(mapStateToProps, { playBackgroundMusic }))(HATicketsPage);
