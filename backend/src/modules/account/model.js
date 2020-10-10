import mongoose from 'mongoose';
import gm from '../../helpers/global-models';

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    activatedOn: Date,
    _metadata: gm._metadata,
    oAuthConfigured: { type: Boolean, default: false },
    _logs: [gm._logs],
  },
  { versionKey: false }
);

function generatedMetadataAccountId(next) {
  const accountId = this._id;
  this._metadata.createdByAccountId = accountId;
  next();
}

accountSchema.pre('validate', generatedMetadataAccountId);

const Account = mongoose.model('Account', accountSchema, 'synvia_account');

export default Account;
