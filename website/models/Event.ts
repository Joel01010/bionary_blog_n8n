import mongoose, { Schema, Model } from "mongoose";

export interface IEvent {
  eventName: string;
  clubName: string;
  category: string;
  dateOfEvent: Date;
  timeOfEvent: string;
  timestamp: Date;
  venue: string;
  description: string;
  image: string; // base64 encoded image
  organizerName: string;
  organizerPhone: string;
}

const EventSchema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    clubName: {
      type: String,
      required: [true, "Club name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    dateOfEvent: {
      type: Date,
      required: [true, "Date of event is required"],
    },
    timeOfEvent: {
      type: String,
      required: [true, "Time of event is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    organizerName: {
      type: String,
      required: [true, "Organizer name is required"],
      trim: true,
    },
    organizerPhone: {
      type: String,
      required: [true, "Organizer phone is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

// Prevent model recompilation during hot reload in development
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
