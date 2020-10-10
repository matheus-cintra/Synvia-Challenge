import mongoose from 'mongoose';

const iplocation = {
  businessName: String,
  businessWebsite: String,
  city: String,
  continent: String,
  country: String,
  countryCode: String,
  ipName: String,
  ipType: String,
  isp: String,
  lat: String,
  lon: String,
  org: String,
  query: String,
  region: String,
  status: String,
};

function logSchema() {
  return new mongoose.Schema({
    momentLocation: iplocation,
    createdAt: { type: Date, default: Date.now },
    createdByAccountId: mongoose.Schema.Types.ObjectId,
    action: { type: String, required: true, default: 'CREATED' }, // 'CREATED', 'UPDATED', 'REMOVED', 'RESTORED', 'DELETED'
    dataBefore: Object,
    dataAfter: Object,
  });
}

function metadataSchema() {
  return new mongoose.Schema({
    registerLocation: iplocation,
    createdByAccountId: mongoose.Schema.Types.ObjectId,
  });
}

module.exports = {
  _logs: logSchema(),
  _metadata: metadataSchema(),
};
