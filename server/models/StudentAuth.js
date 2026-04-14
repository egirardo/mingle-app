import mongoose from 'mongoose';

const studentAuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Normalizes "User@Email.com" -> "user@email.com" to ensure uniqueness
      trim: true,
    },
    password: {
      type: String,
      required: true, // Stored as bcrypt hash
      select: false,
    },
    likes: {
      type: [{
        profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
        type: { type: String, enum: ['company'], required: true },
        _id: false,
      }],
      default: [],
    },
  },
  { timestamps: true }
);

const StudentAuth = mongoose.model('StudentAuth', studentAuthSchema);
export default StudentAuth;