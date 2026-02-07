/**
 * Parses validation error messages and groups them by field name
 *
 * @param errors - Array of error messages from the API
 * @returns Object with field names as keys and arrays of error messages as values
 *
 * @example
 * Input: ["firstName must be a string", "First name is required", "email is invalid"]
 * Output: { firstName: ["firstName must be a string", "First name is required"], email: ["email is invalid"] }
 */
export function parseValidationErrors(
  errors: Array<{ field: string; message: string }> | string[],
): Record<string, string[]> {
  const errorMap: Record<string, string[]> = {};

  if (!errors || errors.length === 0) {
    return errorMap;
  }

  // Handle array of error objects
  if (typeof errors[0] === 'object' && 'field' in errors[0]) {
    const errorObjects = errors as Array<{ field: string; message: string }>;
    errorObjects.forEach((error) => {
      const field = error.field;
      if (!errorMap[field]) {
        errorMap[field] = [];
      }
      errorMap[field].push(error.message);
    });
    return errorMap;
  }

  // Handle array of error strings
  const errorStrings = errors as string[];
  errorStrings.forEach((errorMessage) => {
    // Try to extract field name from error message
    // Common patterns:
    // - "firstName must be a string"
    // - "First name is required"
    // - "email is invalid"

    const field = extractFieldName(errorMessage);

    if (!errorMap[field]) {
      errorMap[field] = [];
    }
    errorMap[field].push(errorMessage);
  });

  return errorMap;
}

/**
 * Extracts field name from validation error message
 */
function extractFieldName(errorMessage: string): string {
  // Try to match camelCase field names at the start of the message
  const camelCaseMatch = errorMessage.match(/^([a-z][a-zA-Z0-9]*)\s/);
  if (camelCaseMatch) {
    return camelCaseMatch[1];
  }

  // Try to match "Field name" patterns and convert to camelCase
  const fieldNamePatterns = [
    /^First name/i,
    /^Last name/i,
    /^Job title/i,
    /^Email/i,
    /^Legal name/i,
    /^Institution type/i,
    /^Accreditation number/i,
    /^Street address/i,
    /^City/i,
    /^State/i,
    /^Province/i,
    /^ZIP/i,
    /^Postal code/i,
    /^Official website/i,
    /^Username/i,
    /^Password/i,
  ];

  const fieldNameMap: Record<string, string> = {
    'first name': 'firstName',
    'last name': 'lastName',
    'job title': 'jobTitle',
    email: 'email',
    'legal name': 'legalName',
    'institution type': 'institutionType',
    'accreditation number': 'accreditationNumber',
    'street address': 'streetAddress',
    city: 'city',
    state: 'stateProvince',
    province: 'stateProvince',
    zip: 'zipPostalCode',
    'postal code': 'zipPostalCode',
    'official website': 'officialWebsite',
    username: 'username',
    password: 'password',
  };

  for (const pattern of fieldNamePatterns) {
    if (pattern.test(errorMessage)) {
      const match = errorMessage.match(pattern);
      if (match) {
        const fieldKey = match[0].toLowerCase();
        return fieldNameMap[fieldKey] || 'general';
      }
    }
  }

  // Default to 'general' if we can't determine the field
  return 'general';
}

/**
 * Formats error map for display
 */
export function formatErrorsForDisplay(
  errorMap: Record<string, string[]>,
): string {
  return Object.entries(errorMap)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('; ');
}
