import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const ticketedEventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true, 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ticketTypes: [{
      id: {
        type: String,
        required: true,
      },
      availableQuantity: {
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
    title: this.title,
    subtitle: this.subtitle,
    location: this.location,
    description: this.description,
    user: this.user.toJSON(),
    tickets: this.tickets,
    dates: this.dates,
  };
};

const TicketedEvent = mongoose.model('TicketedEvent', ticketedEventSchema);

export default TicketedEvent;
