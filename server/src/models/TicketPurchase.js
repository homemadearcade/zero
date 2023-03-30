import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

    // const gameResponse = await addArcadeGame({
    //   userMongoId: data.participants
    // });
    // const game = gameResponse.data.game
    // const participantId = data.participants
    // const lobbyInstanceResponse = await addLobbyInstance({ game: game.id, participants: [data.participants], participantId: participantId,  startTime: data.startTime });
    // const lobbyInstance =lobbyInstanceResponse.data.lobbyInstance

const ticketPurchase = new Schema(
  {
    ticketPurchaseId: {
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
    lobbyInstance: { type: mongoose.Schema.Types.ObjectId, ref: 'LobbyInstance' },
  },
  { timestamps: true },
);

ticketPurchase.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    dateId: this.dateId,
    ticketId: this.ticketId,
    ticketPurchaseId: this.ticketPurchaseId,
    lobbyInstance: this.lobbyInstance?.toJSON(),
    user: this.user?.toJSON(),
    ticketedEvent: this.ticketedEvent?.toJSON(),
  };
};

const TicketPurchase = mongoose.model('TicketPurchase', ticketPurchase);

export default TicketPurchase;
