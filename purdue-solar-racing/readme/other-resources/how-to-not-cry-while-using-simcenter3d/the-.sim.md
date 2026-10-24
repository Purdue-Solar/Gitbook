---
description: >-
  The simulation file (.sim) is where loads and boundary conditions are added to
  solutions.
---

# The .sim

* Model Setup check is kinda useless
  * honestly idk what it even does
* Want other info in your solution results?
  * right click the solution > "edit" > case control > structural output requests > edit > rerun sim
  * I highly recommend turning on strain energy and then viewing strain energy _density_ in the results. This is a great tool for visualizing the flow of strain (load) throughout your structure.
* Convergence
  * When stress-elemental and stress-elemental-nodal are about equal, your solution is most accurate (your mesh is typically fine enough).
