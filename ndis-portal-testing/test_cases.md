# Test Cases

**Project:** NDIS Portal  
**Version:** 1.0  
**Date:** May 3, 2026  
**Related Plan:** test_plan.md  

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ⬜ | Not Run |
| 🔄 | In Progress |
| ✅ | Pass |
| ❌ | Fail |
| ⏭️ | Skipped |

---

## Module 1 — Database (SQL Validation)

---

### TC_DB_01 — Database Creation Validation
- Verify `ndis_portal_db` is created successfully  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-15
**Status:** ✅  

---

### TC_DB_02 — Table Structure Validation
- Verify tables: users, services, bookings, service_categories, support_workers  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-16
**Status:** ✅  

---

### TC_DB_03 — Data Creation Validation
- Insert sample data  
- Verify records stored correctly  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-17
**Status:** ✅  

---

## Module 2 — API Testing

---

### TC_API_01 — Login API Validation
- Valid login → 200 OK  
- Invalid login → 401 Unauthorized  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-23
**Status:** ✅  

---

### TC_API_02 — Register API Validation
- Create new user  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-22
**Status:** ✅  

---

### TC_API_03 — Service Category API Validation
- Fetch service categories  
- Validate response structure  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-18
**Status:** ✅  

---

### TC_API_04 — Services API Validation
- Fetch services list  
- Validate data accuracy  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-19
**Status:** ✅  

---

### TC_API_05 — Support Workers API Validation
- Retrieve support worker data  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-21
**Status:** ✅  

---

### TC_API_06 — Bookings API Validation
- Create booking  
- Verify status handling  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-20
**Status:** ✅  

---

### TC_API_07 — Chatbot API Validation
- Send prompt  
- Validate response (or simulated response)  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-80
**Status:** ✅  

---

## Module 3 — UI Manual Testing

---

### Authentication

#### TC_UI_01 — Login Page
- Enter valid/invalid credentials  
- Verify behavior  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-66
**Status:** ✅  

---

#### TC_UI_02 — Register Page
- Register new account  
- Verify success  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-67
**Status:** ✅  

---

### Participant Features

#### TC_UI_03 — Services List Page
- View all services  
- Apply filters  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-68
**Status:** ✅  

---

#### TC_UI_04 — Service Detail Page
- View selected service details  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-68
**Status:** ✅  

---

#### TC_UI_05 — Book a Service Page
- Submit booking request  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-70
**Status:** ✅  

---

#### TC_UI_06 — My Bookings Page
- View personal bookings  
- Verify statuses  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-71
**Status:** ✅  

---

#### TC_UI_07 — AI Chatbot UI
- Open chatbot  
- Send message  
- Verify UI response  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-73
**Status:** ✅  

---

### Coordinator Features

#### TC_UI_08 — Coordinator Dashboard
- View summary cards  
- Verify booking stats  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-109
**Status:** ✅  

---

#### TC_UI_09 — View All Bookings Page
- View all participant bookings  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-72
**Status:** ✅  

---

#### TC_UI_10 — Manage Services Page
- Add/Edit/Delete services  
- Activate/Deactivate service  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-110
**Status:** ✅  

---

## Module 4 — Automated Testing (Playwright)

---

### TC_AUTO_01 — Authentication Automation Tests
- Login & register scenarios  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-93
**Status:** ✅  


---

### TC_AUTO_02 — Services Automation Tests
- Browse and interact with services  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-94
**Status:** ✅  

---

### TC_AUTO_03 — Bookings Automation Tests
- Create and verify bookings  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-95
**Status:** ✅  

---

### TC_AUTO_04 — Coordinator Automation Tests
- Approve/cancel bookings  
- Manage services  
https://thrivesolutions-team.atlassian.net/browse/ASTRA-96
**Status:** ✅  

---

### TC_AUTO_05 — End-to-End System Test
- Overall Requirements
https://thrivesolutions-team.atlassian.net/browse/ASTRA-95
**Status:** ✅  

---

## Test Execution Summary

| Module | Total | ✅ Pass | ❌ Fail | ⬜ Not Run |
|---|---|---|---|---|
| Database | 3 | 3 | 0 | 0 |
| API | 7 | 7 | 0 | 0 |
| UI | 10 | 10 | 0 | 0 |
| Automation | 5 | 5 | 0 | 0 |
| **TOTAL** | **25** | **25** | **0** | **0** |

---