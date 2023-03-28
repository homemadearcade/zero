import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

    // const gameResponse = await addArcadeGame({
    //   userId: data.participants
    // });
    // const game = gameResponse.data.game
    // const participantId = data.participants
    // const lobbyResponse = await addLobby({ game: game.id, participants: [data.participants], participantId: participantId,  startTime: data.startTime });
    // const lobby =lobbyResponse.data.lobby

const ticketPurchase = new Schema(
  {
    ticketPurchaseShortId: {
      immuteable: true,
      type: String,
      unique: true,
      index: true,
    },
    ticketId: {
      type: String,
      required: true,
    },
    dateId: {
      type: String,
      required: true,
    },
    ticketedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketedEvent' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lobby: { type: mongoose.Schema.Types.ObjectId, ref: 'Lobby' },
  },
  { timestamps: true },
);

ticketPurchase.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    dateId: this.dateId,
    ticketId: this.ticketId,
    ticketPurchaseShortId: this.ticketPurchaseShortId,
    lobby: this.lobby?.toJSON(),
    user: this.user?.toJSON(),
    ticketedEvent: this.ticketedEvent?.toJSON(),
  };
};

const TicketPurchase = mongoose.model('TicketPurchase', ticketPurchase);

export default TicketPurchase;
