import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './HATicketsPage.scss';
import { playBackgroundMusic } from '../../store/actions/portfolioActions';
import ProjectHeader from '../../marketing/wishLabs/ProjectHeader/ProjectHeader';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import { Container } from '@mui/system';
import { Divider, IconButton } from '@mui/material';
import EventDatePicker from '../../ticketing/EventDatePicker/EventDatePicker';
import TicketTypePicker from '../../ticketing/TicketTypePicker/TicketTypePicker';
import ScrollDialog from '../../ui/ScrollDialog/ScrollDialog';
import { getTicketedEvents } from '../../store/actions/ticketedEventActions';
import Loader from '../../ui/Loader/Loader';
import { clearCartTicket, updateCartTicketCount } from '../../store/actions/checkoutActions';
import { getServiceFee, getTicketPurchaseInfo, getTotalWithFee } from '../../utils/ticketUtils';
import { dollarizer } from '../../utils/utils';

const HATicketsPage = ({ getTicketedEvents, clearCartTicket, updateCartTicketCount, ticketedEvent: { ticketedEvent }, checkout: { ticketCart } }) => {
  useEffect(() => {
    getTicketedEvents();
  }, []);

  let [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  let [selectedDateId, setSelectedDateId] = useState(false)

  if(!ticketedEvent) return <Loader></Loader>

  function handleDialogClose() {
    setTimeout(() => {
      setSelectedDateId(false)
      clearCartTicket()
    }, 200)
    setIsDatePickerOpen(false)
  }

  const selectedDate = ticketedEvent.dates.filter(({ id }) => {
    return id === selectedDateId
  })[0]

  function LineItem({children}) {
    return <div className="PurchaseDialog__line-item">
      {children}
    </div>  
  }

  const enrichedTickets = Object.keys(ticketCart.tickets).map((ticketId) => {
    const ticketData = ticketCart.tickets[ticketId]
    return {...ticketData, ...getTicketPurchaseInfo({ticketPurchase: {...ticketData, dateId: selectedDateId }, ticketedEvent})}
  }).filter((ticket) => {
    return ticket.quantity
  })

  const subtotal = enrichedTickets.reduce((prev, next) => {
    return prev + (next.price * next.quantity)
  }, 0)

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
          {selectedDateId && <Typography variant="subtitle1">{selectedDate.month} {selectedDate.day} {selectedDate.time}</Typography>}
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
        {selectedDateId && <div className="PurchaseDialog__return">
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              setSelectedDateId(null)
              clearCartTicket()
            }}
            aria-label="close"
          >
            <Icon icon="faArrowLeft"></Icon>
          </IconButton>
        </div>}
      </>}
      actions={<Button size="large" variant="contained" disabled={!(ticketCart.dateId && ticketCart.ticketedEventId && enrichedTickets.length)}>
        Checkout
      </Button>}
      maxWidth={false} 
      open={isDatePickerOpen} onClose={() => {
        handleDialogClose()
      }}>
      <div className="PurchaseDialog">
        <div className='PurchaseDialog__content'>
          <div className='PurchaseDialog__picker'>
            {!selectedDateId && <EventDatePicker 
              event={ticketedEvent}
              onClickTicket={(id) => {
                setSelectedDateId(id)
              }}
            />}
            {selectedDateId && <TicketTypePicker 
              dateId={selectedDateId}
              tickets={ticketedEvent.tickets}
              onChangeTicketAmount={(id, amount) => {
                updateCartTicketCount({
                  tickets: {
                    [id]: {
                      quantity: amount,
                      ticketId: id
                    }
                  },
                  dateId: selectedDateId,
                  ticketedEventId: ticketedEvent.id
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
            {enrichedTickets.length > 0 && <div className="PurchaseDialog__receipt">
              <LineItem>
                <Typography variant="h5">Order Summary</Typography>
              </LineItem>
              {enrichedTickets.map((ticket) => {
                return <LineItem>
                  <Typography variant="subtitle2">{ticket.quantity + ' x ' + ticket.name}</Typography>
                  <Typography variant="subtitle2">{dollarizer.format(ticket.price)}</Typography>
                </LineItem>
              })}
              <Divider></Divider>
              <LineItem>
                <Typography variant="subtitle2">Subtotal</Typography>
                <Typography variant="subtitle2">{dollarizer.format(subtotal)}</Typography>
              </LineItem>
              <LineItem>
                <Typography variant="subtitle2">Service Fee</Typography>
                <Typography variant="subtitle2">{dollarizer.format((getServiceFee(subtotal)))}</Typography>
              </LineItem>
              <Divider></Divider>
              <LineItem>
                <Typography variant="h4">Total</Typography>
                <Typography variant="h4">{dollarizer.format((getTotalWithFee(subtotal)))}</Typography>
              </LineItem>
            </div>}
          </div>
        </div>
      </div>
    </ScrollDialog>
  </div>

};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent,
  checkout: state.checkout
});

export default compose(
  connect(mapStateToProps, { playBackgroundMusic, getTicketedEvents, clearCartTicket, updateCartTicketCount }))(HATicketsPage);
