/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './TicketTypePicker.scss';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';

const TicketTypePicker = ({ 
  tickets,
  onChangeTicketAmount,
  ticketsInCart,
}) => {
  return (
    <div className="TicketTypePicker">
      {tickets.map(({id, title, amount, amountSold, price}) => {
        return <div className="TicketTypePicker__ticket">
          <div className="TicketTypePicker__ticket-header">
            <Typography variant="h4">{title}</Typography>
            <div className="TicketTypePicker__ticket-buttons">
            <Button variant="outlined" onClick={() => {
              if(ticketsInCart[id] > 0) {
               onChangeTicketAmount(id, ticketsInCart[id] - 1)
              }
            }}>-</Button>
            {ticketsInCart[id] ? ticketsInCart[id] : 0}
            <Button variant="contained" onClick={() => {
              if(!ticketsInCart[id]) {
                onChangeTicketAmount(id, 1)
              } else {
                onChangeTicketAmount(id, ticketsInCart[id] + 1)
              }

            }}>+</Button>
            </div>
          </div>
          <div className="TicketTypePicker__details">
            <Typography variant="h5">${price}</Typography>
            <Typography variant="subtitle1">${(price * .03) + .3}</Typography>
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
)(TicketTypePicker);
