/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './TicketTypePicker.scss';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import { formatter } from '../../utils/utils';
import { getTicketData } from '../../utils/ticketUtils';

const TicketTypePicker = ({ 
  tickets,
  dateId, 
  onChangeTicketAmount,
  ticketsInCart,
  ticketedEvent: { ticketPurchases, ticketedEvent }
}) => {
  return (
    <div className="TicketTypePicker">
      {tickets.map(({id, name, price}) => {

        const { isSoldOut, isAtMax, unsold, remaining } = getTicketData({quantity: ticketsInCart[id], ticketId: id, dateId, ticketPurchases, ticketedEvent})

        return <div className="TicketTypePicker__ticket">
          <div className="TicketTypePicker__ticket-header">
            <Typography variant="h4">{name}</Typography>
            <div className="TicketTypePicker__ticket-buttons">
            <Button variant="outlined" onClick={() => {
              if(ticketsInCart[id] > 0) {
               onChangeTicketAmount(id, ticketsInCart[id] - 1)
              }
            }}>-</Button>
            {ticketsInCart[id] ? ticketsInCart[id] : 0}
            <Button disabled={isAtMax || isSoldOut} variant="contained" onClick={() => {
              if(!ticketsInCart[id]) {
                onChangeTicketAmount(id, 1)
              } else {
                onChangeTicketAmount(id, ticketsInCart[id] + 1)
              }
            }}>+</Button>
            </div>
          </div>
          <div className="TicketTypePicker__details">
            <Typography variant="h5">{formatter.format(price)}</Typography>
            <Typography variant="subtitle1">+{formatter.format((price * .03) + .3)}</Typography>
          </div>
        </div>
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent
});

export default compose(
  connect(mapStateToProps, { }),
)(TicketTypePicker);
