function validate(data, rules) {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const val = data[field];
    const label = field.replace(/_/g, ' ');

    if (rule.required && (val == null || (typeof val === 'string' && val.trim() === ''))) {
      errors.push({ field, message: `${label} is required` });
      continue;
    }

    if (val == null || val === '') continue;

    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errors.push({ field, message: `${label} must be a valid email` });
    }

    if (rule.maxLength && typeof val === 'string' && val.length > rule.maxLength) {
      errors.push({ field, message: `${label} must be ${rule.maxLength} characters or less` });
    }

    if (rule.minLength && typeof val === 'string' && val.length < rule.minLength) {
      errors.push({ field, message: `${label} must be at least ${rule.minLength} characters` });
    }

    if (rule.oneOf && !rule.oneOf.includes(val)) {
      errors.push({ field, message: `${label} must be one of: ${rule.oneOf.join(', ')}` });
    }

    if (rule.numeric && isNaN(Number(val))) {
      errors.push({ field, message: `${label} must be a number` });
    }

    if (rule.uuid && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)) {
      errors.push({ field, message: `${label} must be a valid UUID` });
    }
  }

  return errors;
}

module.exports = { validate };
