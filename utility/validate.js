module.exports = (data, validateFields) => {
  const {
    requiredFields,
    stringFields,
    trimmedFields,
    sizedFields,
  } = validateFields;


  const error = (message, location) => ({
    [location]: message,
    code: 422,
    reason: 'ValidationError',
  });

  if (requiredFields) {
    const missingField = requiredFields.find(field => !(field in data));
    if (missingField) return error('Missing field', missingField);
  }
  if (stringFields) {
    const nonStringField = stringFields.find(field => field in data
      && typeof data[field] !== 'string');
    if (nonStringField) {
      return error('Incorrect field type: expected string', nonStringField);
    }
  }
  if (trimmedFields) {
    const nonTrimmedField = trimmedFields.find(field => data[field].trim() !== data[field]);
    if (nonTrimmedField) {
      return error('Cannot start or end with whitespace.', nonTrimmedField);
    }
  }
  if (sizedFields) {
    const tooSmallField = Object.keys(sizedFields).find((field) => {
      const tooSmall = 'min' in sizedFields[field] &&
        data[field].trim().length < sizedFields[field].min;
      return tooSmall;
    });
    const tooLargeField = Object.keys(sizedFields).find(field =>
      'max' in sizedFields[field] && data[field].trim().length > sizedFields[field].max);
    if (tooSmallField || tooLargeField) {
      const message = tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be no more than ${sizedFields[tooLargeField]
          .max} characters long`;
      const x = error(message, tooSmallField || tooLargeField);
      return x;
    }
  }
  return;
}