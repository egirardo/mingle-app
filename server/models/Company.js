import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254, // RFC 5321 maximum
    },
    // Checkbox selection — fixed set of options
    liaSpaces: {
      type: String,
      required: true,
      enum: ['1', '2 or more', "Don't know yet"], // values in form must match these exactly. If we add more values to the form we must add them here too.
      maxlength: 20,
    },
    // Skills the company is looking for — stored same way as student skills
    // Checkbox selections as an array e.g. ['JavaScript', 'React', 'Node.js']
    skills: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
    },

    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    website: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', companySchema);
export default Company;