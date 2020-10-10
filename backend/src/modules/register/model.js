import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 4 },
    createdOn: { type: Date, default: Date.now() },
    activated: { type: Boolean, default: false },
  },
  { versionKey: false }
);

async function generateHash(next) {
  try {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;
  } catch (err) {
    return next(err);
  }
  return next();
}

registrationSchema.pre('save', generateHash);

const Registration = mongoose.model(
  'Registration',
  registrationSchema,
  'synvia_registration_users'
);

export default Registration;
