// import { Schema, model } from 'mongoose';


// const urlSchema = new Schema({
//     shortID: { type: String, required: true, unique: true },
//     redirectURL: { type: String, required: true },
//     visitHistory: [{timestamp:{type: Number} }],
//     created_at: { type: Date, default: Date.now }
// }, { timestamps: true });


// const URL = model('url', urlSchema);

// export default URL;

import { Schema, model } from "mongoose";

const visitSchema = new Schema({
  timestamp: { type: Date, default: Date.now },

  ip: String,

  geo: {
    country: String,
    region: String,
    city: String,
    timezone: String,
  },

  device: {
    browser: String,
    os: String,
    deviceType: String,
  }
});

const urlSchema = new Schema(
  {
    shortID: { type: String, required: true, unique: true },
    redirectURL: { type: String, required: true },
    visitHistory: [visitSchema],
  },
  { timestamps: true }
);

const URL = model("url", urlSchema);
export default URL;
