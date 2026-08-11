---
description: >-
  Custom battery manager that measures cell voltages and temperatures, provides
  proper start-up and shutdown of the battery, and protects it in the case of
  faults.
---

# Battery Management System

Intended author: Han Luu

1. Purpose
2. Requirements
3. Architecture
4. Interfaces
5. Rationale
6. Failure modes
7. Testing procedures
8. Bring-up procedures
9. Lessons learned

The battery manager consists of two parts, the controller and the cell-group monitors.
