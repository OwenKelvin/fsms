# backend-registration-service

This library provides the core registration service for handling institution registration workflows.

## Features

- Profile information validation with email format and uniqueness checks
- Job title lookup and creation
- Institution details validation
- Admin credentials validation with password strength requirements
- Workflow state progression logic
- Registration status tracking and audit trail

## Usage

```typescript
import { RegistrationService } from '@fsms/backend/registration-service';

// Inject the service in your module
constructor(private registrationService: RegistrationService) {}

// Validate profile information
const result = await this.registrationService.validateProfileInfo({
  firstName: 'John',
  lastName: 'Doe',
  jobTitle: 'Administrator',
  email: 'john.doe@example.com'
});

// Create or find job title
const jobTitle = await this.registrationService.findOrCreateJobTitle('Administrator');

// Validate institution details
const institutionResult = await this.registrationService.validateInstitutionDetails({
  legalName: 'Example University',
  institutionType: InstitutionType.EDUCATIONAL,
  accreditationNumber: 'ACC123456',
  streetAddress: '123 Main St',
  city: 'Anytown',
  stateProvince: 'State',
  zipPostalCode: '12345',
  officialWebsite: 'https://example.edu'
});

// Validate admin credentials
const credentialsResult = await this.registrationService.validateAdminCredentials({
  username: 'admin',
  password: 'SecurePass123!',
  passwordConfirmation: 'SecurePass123!',
  enableTwoFactor: true
});
```

## Requirements Covered

- 1.1, 1.2, 1.3, 1.5: Profile information management and validation
- 2.1, 2.2, 2.3, 2.5: Institution details processing and validation
- 4.1, 4.2, 4.3, 4.5: Admin credentials and authentication validation
- 1.4: Job title management with foreign key relationships