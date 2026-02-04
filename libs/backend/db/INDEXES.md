# Database Indexes Documentation

## Registration System Performance Indexes

This document describes the database indexes added to optimize registration-related queries.

### Registration Records Table

#### Composite Indexes
- **idx_registration_records_status_created_at**: Optimizes queries filtering by status and date range
  - Use case: `WHERE status = 'pending' AND created_at BETWEEN date1 AND date2`
  
- **idx_registration_records_status_completed_at**: Optimizes queries filtering by status and completion date
  - Use case: `WHERE status = 'approved' AND completed_at IS NOT NULL`
  
- **idx_registration_records_institution_admin**: Optimizes relationship queries between institutions and admin users
  - Use case: Joining registration records with institutions and users

#### Single Column Indexes
- **idx_registration_records_created_at**: Optimizes date range queries
  - Use case: `WHERE created_at BETWEEN date1 AND date2`

### Users Table

#### Unique Indexes
- **idx_users_email**: Optimizes email uniqueness checks during registration validation
  - Use case: `WHERE email = 'user@example.com'`
  
- **idx_users_username**: Optimizes username uniqueness checks during registration validation
  - Use case: `WHERE username = 'johndoe'`

### Registration Documents Table

#### Composite Indexes
- **idx_registration_documents_reg_verification**: Optimizes document verification queries
  - Use case: `WHERE registration_id = X AND verification_status = 'pending'`
  
- **idx_registration_documents_type_verification**: Optimizes queries by document type and verification status
  - Use case: `WHERE document_type = 'accreditation_certificate' AND verification_status = 'pending'`

### Registration Status History Table

#### Composite Indexes
- **idx_registration_status_history_reg_changed**: Optimizes audit trail queries
  - Use case: `WHERE registration_id = X ORDER BY changed_at DESC`

### Job Titles Table

#### Single Column Indexes
- **idx_job_titles_title**: Optimizes job title lookups during registration
  - Use case: `WHERE title = 'Principal'`
  
- **idx_job_titles_is_active**: Optimizes queries for active job titles
  - Use case: `WHERE is_active = true`

## Performance Benefits

1. **Faster Registration Status Queries**: Composite indexes on status and date fields enable efficient filtering of registrations by status and time ranges.

2. **Optimized Uniqueness Checks**: Explicit indexes on email and username fields speed up validation during registration.

3. **Efficient Relationship Queries**: Composite indexes on foreign key relationships optimize joins between institutions, users, and documents.

4. **Quick Document Verification**: Indexes on document type and verification status enable fast retrieval of documents requiring review.

5. **Improved Audit Trail Access**: Composite index on registration_id and changed_at enables efficient retrieval of status history.

## Query Examples

### Find pending registrations created in the last 7 days
```sql
SELECT * FROM registration_records 
WHERE status = 'pending' 
AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
-- Uses: idx_registration_records_status_created_at
```

### Check email uniqueness
```sql
SELECT id FROM users WHERE email = 'user@example.com';
-- Uses: idx_users_email
```

### Find documents requiring verification for a registration
```sql
SELECT * FROM registration_documents 
WHERE registration_id = 123 
AND verification_status = 'pending';
-- Uses: idx_registration_documents_reg_verification
```

### Get registration status history
```sql
SELECT * FROM registration_status_history 
WHERE registration_id = 123 
ORDER BY changed_at DESC;
-- Uses: idx_registration_status_history_reg_changed
```

## Maintenance Notes

- All indexes are created with explicit names for easier identification and management
- Indexes are automatically dropped when the migration is rolled back
- Monitor index usage with PostgreSQL's `pg_stat_user_indexes` view
- Consider periodic REINDEX operations for heavily updated tables
