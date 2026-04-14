// ─── SHARED CONSTANTS ────────────────────────────────────────────────────────

export const VALID_PROGRAMS = ['Digital Designer', 'Web Developer'];

export const VALID_LIA_SPACES = ['1', '2 or more', "Don't know yet"];

export const VALID_SKILLS = [
  'UI', 'UX', 'Frontend', 'Backend', 'Motion Design', '3D', 'Fullstack',
  'Branding', 'Graphic Design', 'HTML/CSS', 'JavaScript', 'React',
  'Git', 'PHP', 'REST', 'Accessibility', 'Laravel', 'C#', 'TypeScript',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── RULE FACTORIES ───────────────────────────────────────────────────────────
// Each factory returns a function (value) => errorString | null

export const rules = {
  isString: (label) => (v) =>
    typeof v !== 'string' ? `${label} must be a string` : null,

  nonEmpty: (label) => (v) =>
    typeof v === 'string' && v.trim().length === 0
      ? `${label} cannot be empty`
      : null,

  minLen: (label, min) => (v) =>
    typeof v === 'string' && v.length < min
      ? `${label} must be at least ${min} characters`
      : null,

  maxLen: (label, max) => (v) =>
    typeof v === 'string' && v.trim().length > max
      ? `${label} must be ${max} characters or fewer`
      : null,

  email: (label) => (v) =>
    typeof v === 'string' && !EMAIL_RE.test(v.trim())
      ? `${label} is not a valid email address`
      : null,

  oneOf: (label, options) => (v) =>
    !options.includes(v)
      ? `${label} must be one of: ${options.join(', ')}`
      : null,

  isArray: (label) => (v) =>
    !Array.isArray(v) ? `${label} must be an array` : null,

  arrayOfStrings: (label) => (v) =>
    Array.isArray(v) && v.some((item) => typeof item !== 'string')
      ? `${label} must contain only strings`
      : null,

  arrayAllowed: (label, allowed) => (v) => {
    if (!Array.isArray(v)) return null;
    const invalid = v.find((item) => !allowed.includes(item));
    return invalid ? `${label} contains an invalid value: "${invalid}"` : null;
  },

  maxArrayLen: (label, max) => (v) =>
    Array.isArray(v) && v.length > max
      ? `${label} must have ${max} or fewer items`
      : null,

  arrayItemMaxLen: (label, max) => (v) => {
    if (!Array.isArray(v)) return null;
    const over = v.find((item) => typeof item === 'string' && item.length > max);
    return over ? `Each ${label} item must be ${max} characters or fewer` : null;
  },

  noDelimiter: (label, delimiter) => (v) =>
    Array.isArray(v) && v.some((item) => typeof item === 'string' && item.includes(delimiter))
      ? `${label} items cannot contain "${delimiter}"`
      : null,

  safeUrl: (label) => (v) => {
    if (typeof v !== 'string' || !v.trim()) return null;
    const candidate = /^[a-z][a-z\d+\-.]*:/i.test(v.trim())
      ? v.trim()
      : `https://${v.trim()}`;
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return `${label} must be an http or https URL`;
      }
      return null;
    } catch {
      return `${label} is not a valid URL`;
    }
  },
};

// ─── MIDDLEWARE FACTORY ───────────────────────────────────────────────────────
// schema: { fieldName: { required?: bool, label?: string, rules?: fn[] } }
// partial: true — skips required checks for absent fields (use for PATCH/PUT updates)
export function validateBody(schema, { partial = false } = {}) {
  return (req, res, next) => {
    for (const [field, config] of Object.entries(schema)) {
      const inBody = field in req.body;
      const value = req.body[field];

      if (!inBody) {
        if (config.required && !partial) {
          return res.status(400).json({ message: `${config.label ?? field} is required` });
        }
        continue;
      }

      for (const rule of (config.rules ?? [])) {
        const err = rule(value);
        if (err) return res.status(400).json({ message: err });
      }
    }
    next();
  };
}
