# Test Plan

**Project:** NDIS Portal  
**Version:** 1.0  
**Date:** May 3, 2026  
**Author:** Shahlyna Abdullah 
**Status:** Draft → In Review → Approved  

---

## 1. Introduction

### 1.1 Purpose
This document defines the testing strategy, scope, schedule, and
responsibilities for validating the NDIS Portal before release to production.

### 1.2 Background

The NDIS Participant Service Portal is a full-stack web application designed to streamline interactions between NDIS participants and support coordinators.

The system enables participants to discover support services, submit booking requests, and track their booking status. Coordinators are responsible for managing services, overseeing bookings, and ensuring proper service delivery.

The platform includes modern features such as AI-assisted service discovery, automated end-to-end testing, and ETL-based data processing.

The NDIS Participant Service Portal is a full-stack web application designed to streamline interactions between NDIS participants and support coordinators.

---

## 2. Objectives

- Verify all portal features work according to functional requirements  
- Ensure role-based access (Participant, Coordinator) functions correctly  
- Validate booking workflows (request, approve, cancel)  
- Ensure proper error handling and validation messages  
- Confirm system usability and responsiveness across browsers  

---

## 3. Scope

### In Scope
- User registration and authentication  
- Role-based dashboards:
  - Participant Dashboard  
  - Coordinator Dashboard  
- Booking system:
  - Participant submits booking requests  
  - Coordinator approves or cancels bookings  
- Service management (Coordinator only)  
- Support worker management (Coordinator only)  
- AI Chatbot / Service Recommendation feature (Participant)  
- Notifications and booking status updates  
- Form validation and error handling  

### Out of Scope
- Advanced security/penetration testing  
- Load testing beyond 100 concurrent users  
- Mobile native application testing  
- Third-party infrastructure failures  

---
## 4. Testing Approach

Testing for the NDIS Portal is conducted using a combination of database validation, API testing, manual user interface testing, and automated end-to-end testing.

### 4.1 SQL Database Validation
- Validate data integrity and relationships between tables (users, services, bookings, support_workers)  
- Verify CRUD operations reflect correctly in the database  
- Execute SQL queries to confirm booking statuses and data consistency  

---

### 4.2 API Testing
- Test all backend endpoints using Postman/Swagger  
- Validate request/response structure and status codes  
- Verify authentication and authorization behavior  
- Ensure correct handling of invalid inputs and error responses  

---

### 4.3 Manual UI Testing
- Validate user workflows through the Angular frontend  
- Test role-based access (Participant vs Coordinator)  
- Verify form validations, error messages, and UI responsiveness  
- Ensure correct navigation and data display  

---

### 4.4 Automated Testing (Playwright)
- Execute end-to-end test scripts for critical user flows:
  - User registration and login  
  - Service browsing  
  - Booking creation and status tracking  
  - Coordinator approval/cancellation workflows  
  - Chatbot testing
- Run tests in headed mode 

---

### 4.5 Test Strategy Summary

| Testing Type | Purpose | Tool |
|---|---|---|
| Database Testing | Data integrity and validation | SQL Server (SSMS) |
| API Testing | Backend functionality | Postman / Swagger |
| Manual Testing | UI and usability | Browser |
| Automated Testing | Core function validation | Playwright |

---

## 5. Test Environment

| Environment | URL | Purpose |
|---|---|---|
| DEV | dev.ndis-portal.com | Developer testing |
| SIT | sit.ndis-portal.com | System integration testing |
| UAT | uat.ndis-portal.com | User acceptance testing |
| PROD | ndis-portal.com | Live system |

**Test Data:**
- Use synthetic or anonymized data only  
- No real participant data in non-production environments  
- Seed scripts located in `/tests/data/seed.sql`  

---

## 6. Entry & Exit Criteria

### Entry Criteria (before testing begins)
- [ ] Build deployed to SIT environment  
- [ ] All unit tests passing (0 failures)  
- [ ] Test data prepared and seeded  
- [ ] Test cases reviewed and approved  

### Exit Criteria (before sign-off)
- [ ] All critical (P1) and major (P2) test cases passed  
- [ ] No open Critical or High severity defects  
- [ ] UAT sign-off completed  
- [ ] Test summary report submitted  

---

## 7. Risk & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Environment instability | Medium | High | Daily environment checks |
| Incomplete requirements | High | High | Frequent stakeholder reviews |
| Booking workflow defects | Medium | High | Prioritize E2E testing |
| AI recommendation inaccuracies | Medium | Medium | Validate against expected outputs |
| Limited test data | Low | Medium | Automate seed scripts |

---

## 8. Roles & Responsibilities

| Role | Name | Responsibility |
|---|---|---|
| QA Lead | Shahlyna Abdullah | Test planning and approval |
| QA Engineer | Shahlyna Abdullah, Angel Calixtro, Justell Mutia, James Jhurien Serrano | Test execution and reporting |
| Developer | John Axcel Saclao, Karl Lorence Soldevilla, Adahm James Villas, Clarence Cabalan | Bug fixing and support |
| Business Analyst | -- | Requirement clarification |
| Product Owner | Karl Lorence Soldevilla | Final approval |

---

## 9. Schedule

| Phase | Start | End |
|---|---|---|
| Test Planning | April 14 | April 20 |
| Test Case Writing | April 15 | April 28 |
| SIT Execution | April 20 | April 29 |
| Bug Fix & Retest | April 19 | April 29 |
| UAT | April 29 | May 2 |
| Sign-off | April 30 | May 2 |
| Production Release | May 4 | May 4 |

---

## 10. Deliverables

- [ ] Test Plan (`test_plan.md`)  
- [ ] Test Cases (`test_cases.md`)  
- [ ] Test Cases (`bug_log.md`) 
- [ ] Bug Reports (tracked in Jira)  
- [ ] HTML Playwright All Passed test
- [ ] UAT Sign-off Form

---

## 11. Sign-off

QA Approver: Shahlyna Abdullah
Dev Approver: John Axcel Saclao
Product Owner: Karl Lorence Soldevilla
Date: May 2, 2026 
