import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    // Foreign key -> StudentAuth
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentAuth',
      required: true,
      unique: true, // One profile per student
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    program: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    // Checkbox selections stored as an array e.g. ['JavaScript', 'React', 'Node.js']
    // Join with '||' to implode: skills.join('||')
    // Split to explode: skills  (already an array — just map over it)
    skills: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
    },

    about: {
      type: String,
      default: null,
      maxlength: 300,
    },

    // Up to 3 answers imploded into one string with '||' as delimiter
    // e.g. "I love coding||I want to grow||I am a team player"
    // To explode: questions.split('||')
    // Max: 3 answers × 300 chars + 2 delimiters = 902
    questions: {
      type: String,
      default: null,
      maxlength: 902,
    },

    portfolio: {
      type: String, // URL
      default: null,
      maxlength: 500,
    },

    profileImage: { // Profile image is being saved in Cloudinary, so we just store the URL here
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;