import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const ticketPurchase = new Schema(
  {
    ticketType: {
      type: String,
      required: true,
    },
    ticketedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketPurchase' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

ticketPurchase.methods.toJSON = function () {
  return {
    tickets: this.tickets,
    dates: this.dates
  };
};

const TicketPurchase = mongoose.model('TicketPurchase', ticketPurchase);

export default TicketPurchase;
