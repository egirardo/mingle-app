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
  },
  { timestamps: true }
);

const StudentAuth = mongoose.model('StudentAuth', studentAuthSchema);
export default StudentAuth;