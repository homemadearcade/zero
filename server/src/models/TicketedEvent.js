import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const ticketedEventSchema = new Schema(
  {
    ticketedEventId: {
      immuteable: true,
      type: String,
      unique: true,
      index: true,
    },
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
    experienceModel: { type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceModel' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tickets: [{
      ticketId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    }],
    dates: [{ 
      dateId: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    }]
  },
  { timestamps: true },
);

ticketedEventSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    subtitle: this.subtitle,
    location: this.location,
    description: this.description,
    user: this.user?.toJSON(),
    experienceModel: this.experienceModel,
    tickets: this.tickets,
    dates: this.dates,
    ticketedEventId: this.ticketedEventId,
  };
};

const TicketedEvent = mongoose.model('TicketedEvent', ticketedEventSchema);

export default TicketedEvent;
