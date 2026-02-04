import { BadRequestException } from '@nestjs/common';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * Validates that a string is a valid UUID v4 format
 * @param id - The string to validate as UUID
 * @param fieldName - The name of the field being validated (for error messages)
 * @throws BadRequestException if the UUID is invalid
 */
export function validateUUID(id: string, fieldName: string = 'id'): void {
  if (!uuidValidate(id)) {
    throw new BadRequestException(
      `Invalid UUID format for ${fieldName}: ${id}`
    );
  }

  // Verify it's UUID v4
  if (uuidVersion(id) !== 4) {
    throw new BadRequestException(
      `Expected UUID v4 for ${fieldName}, got v${uuidVersion(id)}`
    );
  }
}

/**
 * Checks if a string is a valid UUID v4 without throwing an exception
 * @param id - The string to check
 * @returns true if the string is a valid UUID v4, false otherwise
 */
export function isValidUUID(id: string): boolean {
  return uuidValidate(id) && uuidVersion(id) === 4;
}
