import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Checkbox selection — fixed set of options
    liaSpaces: {
      type: String,
      required: true,
      enum: ['1', '2 or more', "Don't know yet"], // values in form must match these exactly. If we add more values to the form we must add them here too.
    },
    // Skills the company is looking for — stored same way as student skills
    // Checkbox selections as an array e.g. ['JavaScript', 'React', 'Node.js']
    skills: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    about: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },    
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', companySchema);
export default Company;