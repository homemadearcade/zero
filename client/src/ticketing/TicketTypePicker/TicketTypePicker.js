/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './TicketTypePicker.scss';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import { dollarizer } from '../../utils/utils';
import { getServiceFee, getTicketData } from '../../utils/ticketUtils';

const TicketTypePicker = ({ 
  tickets,
  dateId, 
  onChangeTicketAmount,
  checkout: { ticketCart },
  ticketedEvent: { ticketPurchases, ticketedEvent }
}) => {
  return (
    <div className="TicketTypePicker">
      {tickets.map(({id, name, price}) => {

        const { isSoldOut, isAtMax, unsold, remaining } = getTicketData({quantity: ticketCart.tickets[id]?.quantity, ticketId: id, dateId, ticketPurchases, ticketedEvent})

        return <div className="TicketTypePicker__ticket">
          <div className="TicketTypePicker__ticket-header">
            <Typography variant="h4">{name}</Typography>
            <div className="TicketTypePicker__ticket-buttons">
            <Button variant="outlined" disabled={!ticketCart.tickets[id]?.quantity} onClick={() => {
              if(ticketCart.tickets[id]?.quantity > 0) {
               onChangeTicketAmount(id, ticketCart.tickets[id]?.quantity - 1)
              }
            }}>-</Button>
            {ticketCart.tickets[id]?.quantity ? ticketCart.tickets[id].quantity : 0}
            <Button disabled={isAtMax || isSoldOut} variant="contained" onClick={() => {
              if(!ticketCart.tickets[id]) {
                onChangeTicketAmount(id, 1)
              } else {
                onChangeTicketAmount(id, ticketCart.tickets[id]?.quantity + 1)
              }
            }}>+</Button>
            </div>
          </div>
          <div className="TicketTypePicker__details">
            <Typography variant="h5">{dollarizer.format(price)}</Typography>
            <Typography variant="subtitle1">+{dollarizer.format(getServiceFee(price))}</Typography>
          </div>
        </div>
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent,
  checkout: state.checkout
});

export default compose(
  connect(mapStateToProps, { }),
)(TicketTypePicker);
