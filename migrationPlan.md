# MySQL Migration Technical Analysis
**Date:** January 12, 2026
**Author:** Rishabh Sikarwar
**Status:** In Progress

## Overview
This document tracks the schema incompatibilities identified during the initial transition from PostgreSQL to MySQL.

## 1. Schema Validation Errors (Day 1 Findings)
Running `npx prisma validate` with the MySQL provider yielded critical blocking errors.

### Blocker: Unsupported Native Lists (Arrays)
**Error Code:** P1012
**Location:** `model Poll`, field `options`
**Issue:**
- PostgreSQL allows `String[]` (native arrays).
- MySQL does not support scalar lists.

**Required Action:**
- The `options` field in `Poll` must be converted from `String[]` to a `String` (Text) type.
- We will store the array data as a JSON string (serialized array).
- **Impact:** All frontend components reading `poll.options` will need to be updated to parse this JSON string.

## 2. Next Steps
1. Refactor `schema.prisma` to use `@db.Text` for the options field.
2. Create a utility function to serialize/deserialize the JSON data.
3. Audit all other models for similar Array usage.


## 3. Impact Analysis (Code Audit)
The following files interact with the `Poll` model or `options` field and will require refactoring:

**Frontend Components:**
- `app/Polls/page.js`: Main logic for rendering Polls. Currently expects an Array format for options.
- `components/dashboard/DashboardAdmin.jsx`: Admin dashboard widgets linking to Polls.

**Configuration & Logic:**
- `utils/roleConfig.js`: Logic defining role-based access to Polls.
- `prisma/migrations/2025...`: Legacy SQL migrations that will be incompatible.

**Plan:**
We will create a helper function `parsePollOptions(jsonString)` to handle the data transformation in these files.