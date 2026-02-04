# Performance Indexes for Registration System

This document describes the database indexes added to optimize registration-related queries.

## Migration: 20250204000001-add-performance-indexes-for-registration.js

### Registration Records Table

#### Composite Indexes

1. **idx_registration_records_status_created_at**
  - Columns: `status`, `created_at`
  - Purpose: Optimizes queries filtering by status with date range
  - Example Query: `WHERE status = 'pending' AND created_at BETWEEN date1 AND date2`

2. **idx_registration_records_status_completed_at**
  - Columns: `status`, `completed_at`
  - Purpose: Optimizes queries filtering by status and completion date
  - Example Query: `WHERE status = 'approved' AND completed_at IS NOT NULL`

3. **idx_registration_records_institution_admin**
  - Columns: `institution_id`, `admin_user_id`
  - Purpose: Optimizes relationship queries between institutions and admin users
  - Example Query: Joins between registration_records, institutions, and users tables

#### Single Column Indexes

4. **idx_registration_records_created_at**
  - Column: `created_at`
  - Purpose: Optimizes date range queries and sorting
  - Example Query: `WHERE created_at BETWEEN date1 AND date2 ORDER BY created_at DESC`

### Users Table

5. **idx_users_email**
  - Column: `email`
  - Type: UNIQUE
  - Purpose: Optimizes email uniqueness checks during registration validation
  - Example Query: `WHERE email = 'user@example.com'`

6. **idx_users_username**
  - Column: `username`
  - Type: UNIQUE
  - Purpose: Optimizes username uniqueness checks during credential setup
  - Example Query: `WHERE username = 'admin123'`

### Registration Documents Table

#### Composite Indexes

7. **idx_registration_documents_reg_verification**
  - Columns: `registration_id`, `verification_status`
  - Purpose: Optimizes document verification queries per registration
  - Example Query: `WHERE registration_id = X AND verification_status = 'pending'`

8. **idx_registration_documents_type_verification**
  - Columns: `document_type`, `verification_status`
  - Purpose: Optimizes queries filtering by document type and verification status
  - Example Query: `WHERE document_type = 'accreditation_certificate' AND verification_status = 'pending'`

### Registration Status History Table

9. **idx_registration_status_history_reg_changed**
  - Columns: `registration_id`, `changed_at`
  - Purpose: Optimizes audit trail queries with chronological ordering
  - Example Query: `WHERE registration_id = X ORDER BY changed_at DESC`

### Job Titles Table

10. **idx_job_titles_title**
  - Column: `title`
  - Purpose: Optimizes job title lookups during profile information validation
  - Example Query: `WHERE title = 'Principal'`

11. **idx_job_titles_is_active**
  - Column: `is_active`
  - Purpose: Optimizes queries for active job titles
  - Example Query: `WHERE is_active = true`

## Performance Impact

These indexes provide the following performance improvements:

1. **Email/Username Uniqueness Checks**: O(log n) lookup time instead of O(n) table scan
2. **Status Filtering**: Efficient filtering of registrations by status with date ranges
3. **Relationship Queries**: Optimized joins between institutions, users, and documents
4. **Audit Trail Queries**: Fast retrieval of status history with chronological ordering
5. **Document Verification**: Quick identification of documents requiring review

## Query Patterns Optimized

- Registration status dashboard queries
- Date range filtering for administrative reports
- Email/username availability checks during registration
- Document verification workflows
- Audit trail and compliance reporting
- Job title lookups and validation

## Maintenance Notes

- All indexes are automatically maintained by the database
- Index statistics should be monitored for query performance
- Consider periodic ANALYZE/VACUUM operations on PostgreSQL
- Monitor index usage with database performance tools
