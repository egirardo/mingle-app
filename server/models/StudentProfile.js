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
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    program: {
      type: String,
      required: true,
      trim: true,
    },

    // Checkbox selections stored as an array e.g. ['JavaScript', 'React', 'Node.js']
    // Join with '||' to implode: skills.join('||')
    // Split to explode: skills  (already an array — just map over it)
    skills: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    about: {
      type: String,
      default: null,
    },

    // Up to 3 answers imploded into one string with '||' as delimiter
    // e.g. "I love coding||I want to grow||I am a team player"
    // To explode: questions.split('||')
    questions: {
      type: String,
      default: null,
    },

    portfolio: {
      type: String, // URL
      default: null,
    },

    // Profile picture stored as binary in MongoDB
    profileImage: {
      data: {
        type: Buffer,
        default: null,
      },
      contentType: {
        type: String, // e.g. 'image/jpeg', 'image/png'
        default: null,
      },
    },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;