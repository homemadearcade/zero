import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const ticketedEventSchema = new Schema(
  {
    ticketTypes: [{
      id: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    }],
    dates: [{ 
      day: {
        type: String,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    }]
  },
  { timestamps: true },
);

ticketedEventSchema.methods.toJSON = function () {
  return {
    tickets: this.tickets,
    dates: this.dates
  };
};

const TicketedEvent = mongoose.model('TicketedEvent', ticketedEventSchema);

export default TicketedEvent;
