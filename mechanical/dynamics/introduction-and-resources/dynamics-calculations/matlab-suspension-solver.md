---
description: >-
  Tool used to calculate forces used for FEA; found currently in PSR ASC
  26/Mechanical/The Mech FEA
---

# MATLAB Suspension Solver

As the car turns, brakes, or goes over a bump, the tire contact patches experience forces. These forces go through the control arms and tie rods and pushrod in the front, and through the trailing arm endpoints and shock in the rear. To solve for the forces in all those linkages, we set the contact patch forces equal to the linkages’ forces (which we know the direction of using CAD coordinates) and end up with lots of net force equations; this is best handled using matrices in MATLAB. The front sus solver as of 8/29/2026 is pasted at the end of this page.

#### Inputs and how to collect them

* Need mass of whole car, including everything, driver + ballast - use one scale per wheel
* Height of center of gravity - can look up the procedure; involves weighing the front wheels before and after lifting the rear, then use trigonometry and weight difference
* Track width and wheelbase - measured from the middles of the contact patches, distance between front wheels (tw) and distance between front wheels and rear wheel (wb)
* Radius of loaded tire - measure the bottom radius of the tire as it is squished down by the car’s weight
* Front weight distribution - fraction of weight on front wheels over total weight

#### Forces on contact patch

* Each wheel has a static load, that is, the weight of the car at rest - we measured this earlier
  * We calculate the loads at 1 g of acceleration for several different cases and all their combinations - as required by [ASC regulations](https://www.americansolarchallenge.org/wp-content/uploads/2025/11/ASC2026_Regulations_Revision_B.pdf?fbclid=IwVERFWAOMAXFleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAo2NjI4NTY4Mzc5AAEejN329dcS6PGBL-L3Y_7FzCtyOhxTZRx6-8d5jVdsjMYQVny1xytSjrXy8A4_aem_haTb8-S5qEPHOQt6z29-KA)
  * Braking: acceleration in the negative x direction, treated as an external force from the ground in the negative x onto the contact patch
  * Steering: distinct in each front wheel depending on whether you turn towards the chassis or away from it (positive and negative y respectively)
  * Bump: acceleration upwards in the positive z direction from the ground (hitting a bump on the road and moving straight up as a result). Since there is already a normal force from the ground in the z direction from the static weight of the car, we make bump a 2g acceleration
* Weight transfers, longitudinal and lateral, are negative because it occurs opposite it direction from acceleration
  * Even with weight transfer, the total weight on all the wheels stays the same as when static
  * When braking, there is load transferred from the rear to the front wheels (longitudinal weight transfer) - you feel this when you brake in a normal car and it lurches forward
  * The formula for longitudinal weight transfer is (- mass\*brake acceleration\*cg height)/wheelbase
    * Brake acceleration will either be -1 g (-9.8 m/s^2) or 0 for each load case
    * This weight transfer value is added to the front wheels (split between them) and subtracted from the rear wheel
  * When steering, there is load transferred from the inner to the outer wheel - like when you are smushed up against the passenger window during a high speed or tight radius left turn
  * Lateral weight transfer = (- mass\*turn acceleration\*cg height)/track width
    * Turn acceleration is -1 g turning in (left, since the sus solver program is for the left wheel) and 1 g turning out
    * This weight transfer is subtracted from the inner wheel of the turn to the outer wheel

```
% Units: Meters (m), Newtons (N), Kilograms (kg), Acceleration (g)
% Coordinate System: x = forward, y = left (outboard), z = up. Origin at ground.
% Positive = Compression
% Left Wheel

clear; clc;

%% Inputs: Vehicle Parameters
m_car = 330;        % Mass of car + driver (kg)
h_cg = 0.393;       % Center of Gravity Height (m)
tw = 1.2;           % Track Width (m)
wb = 2.2;           % Wheelbase (m)
r_tire = 0.2794;    % Radius of Loaded Tire (m)
fw = 0.6965;        % Percent of weight on front wheel(%)

%% Load Cases and Weight Transfer
% Format: [a_x, a_y, a_z] in g's
% Note: +a_y is turn-in (left), -a_y is turn-out (right)
car_accel_mat = [-1  0  1;  0 -1  1;  0  1  1;  0  0  2;  -1 -1  1; -1  1  1; -1  0  2;  0 -1  2; 0  1  2; -1 -1  2; -1  1  2;  0  0  1];

number_of_load_cases = size(car_accel_mat, 1); 
WT_lat  = zeros(number_of_load_cases, 1); % Matrix accounting for extra Fz force caused by cornering shifting weight to the outer wheel
WT_long = zeros(number_of_load_cases, 1); % Matrix accounting for extra Fz force caused by braking shifting weight to the front axle
F_app   = zeros(number_of_load_cases, 3); % Matrix accounting for Fx, Fy, and Fz of each load case

for i = 1:number_of_load_cases

    % Fz
    % Assumption: Treat vehicle as a point mass. This neglects roll center migration and anti-dive/squat geometries, 
    % but this is cool since we want worst case for FEA anyway. 
    % Treating vehicle like a sprung mass just breaks the matrices and turns it into a transient force model. 
    % This is a static force calculator, and actual dynamic solvers like MotionSolve and LOTUS are meant to calculate dynamic parameters.
    % Weight transfer values are negative because weight transfer occurs in opposite direction to acceleration.
    
    WT_long(i) = -m_car * car_accel_mat(i,1) * 9.81 * h_cg / wb;
    % Value of longitudinal (Braking/Accel) Weight Transfer to the front axle. In three-wheel suspension, 
    % the longitudinal weight is transferred to both the left and right front wheel. 
    %F_long = m_car*car_accel_vector*g
    %WT_long * wb = F_long * h_cg (Moment Balance)

    WT_lat(i)  = -m_car * car_accel_mat(i,2) * 9.81 * h_cg / tw; 
    % Value of lateral (Cornering) Weight Transfer to a single tire. 
    % In three-wheel suspension, the lateral weight is transferred entirely to the outer front wheel. 
    %F_lat = m_car*car_accel_vector*g
    %WT_lat * tw = F_lat * h_cg (Moment Balance)

    F_app(i,3) = m_car  * car_accel_mat(i,3) * 9.81 * (fw/2) + WT_lat(i) + WT_long(i)/2 ; 
    % Tire Vertical force (Fz) including static weight and dynamic transfer
    %F_static = m_car * 9.81 * (fw/2)
    %fw is divided by two because each tire carries half of the force used.
    %WT_long is divided by two because each tire carries half of the total longitudinal (Braking/Accel) force acting on the front axle.
    %WT_lat is NOT divided by two, because the original equation already only accounts for the lateral (Cornering) weight transfer on a single tire. 


    % Fx and Fy
    % Assumption: The horizontal forces (Fx, Fy) generated by the tire are directly proportional to the vertical load (Fz) it carries. 
    % Hence we can multiply the total car Fx and Fy by Fz_percent to find the percent of Fx and Fy on each wheel. 
    % This neglects tire load sensitivity, where Fx and Fy increase nonlinearly with Fz (diminishing returns). 
    % This is fine because it leads to Fx and Fy being overestimated.)

    total_vehicle_weight = m_car * 9.81;

    total_car_Fx = m_car * car_accel_mat(i,1) * 9.81;
    total_car_Fy = m_car * car_accel_mat(i,2) * 9.81;

    Fz_percent = F_app(i,3) / total_vehicle_weight; % Fraction of the vehicle's total weight currently acting on the wheel

    F_app(i,1) = total_car_Fx * Fz_percent; % Tire Longitudinal (Braking/Accel) tire force (Fx) 
    F_app(i,2) = total_car_Fy * Fz_percent; % Tire Lateral (Cornering) tire force (Fy) 

end

%% Suspension Geometry (x, y, z)
% Inboard Chassis Points
in_up_fore   = [0.1381, 0.3376, 0.3715];
in_up_aft    = [-0.1409, 0.3360, 0.3399];
in_low_fore  = [0.1415, 0.3360, 0.1894];
in_low_aft   = [-0.1411, 0.3360, 0.1894];
in_push_pull = [0.0153, 0.3073, 0.4615];
in_tie_toe   = [0.1000, 0.3710, 0.2220];

inboard = [in_up_fore; in_up_aft; in_low_fore; in_low_aft; in_push_pull; in_tie_toe];

% Outboard Upright Points
out_up_fore   = [-0.0106, 0.5450, 0.3915];
out_up_aft    = out_up_fore; % Ball joint
out_low_fore  = [0.0027, 0.5717, 0.19924];
out_low_aft   = out_low_fore; % Ball joint
out_push_pull = [0.0154, 0.5334, 0.2197];
out_tie_toe   = [0.0774, 0.5750, 0.2400];

outboard = [out_up_fore; out_up_aft; out_low_fore; out_low_aft; out_push_pull; out_tie_toe];

%% Vectors and Equilibrium Matrix
% Goal is to get Ax = b , where b is the 6 calculated applied forces and moments, 
% A is the Equilibrium Matrix containing the unit vectors and thus proper force/moment division for the 6 links, 
% and x is the solved, divided force acting on each link.

% Calculate unit vectors for each link (Direction: Outboard to Inboard)
F_sus_vec = inboard - outboard; % Finds the 3D Length vector (x,y,z) for all 6 links (6 x 3 Matrix)
F_sus_unit = zeros(6,3); % Empty matrix for the 6 links and 3 (x,y,z) coordinates. This is a surprise tool that will help us later

for i = 1:6
    link_length = norm(F_sus_vec(i,:)); % Norm just computes the absolute length of each rod using Pythagorean
    F_sus_unit(i,:) = F_sus_vec(i,:) / link_length; % Calculates unit vector (x, y, z) of each link by dividing vector by absolute length
end


contact_patch = [0, tw/2, 0];  
% Assumption: Moment Center at contact patch. This allows all applied moments to be zero, as there is no moment arm between where the forces are applied and where the pivot point is.
moment_center = contact_patch;

% Moment arms (r x F)
r_sus = outboard - moment_center; % Moment arm distance from moment center to outboard

r_app = contact_patch - moment_center; % Moment arm distance from moment center to contact patch. 
% Only useful for if you want to try experimenting with a different moment center assumption.

M_sus = zeros(6,3);
for i = 1:6
    M_sus(i,:) = cross(r_sus(i,:), F_sus_unit(i,:)); % Takes cross product to calculate the unit vector (x,y,z) for the moment on each link. 
    % This is also what allows it to convert force couples into moments and vice versa in the event applied Mx, My, and/or Mz are nonzero.
end

%% Solving Equilibrium Equations (Ax = b)
A_matrix = [F_sus_unit'; M_sus']; 
% Transposes and Conjugates Force/Moment Matrices so that there are 6 unknown rows (sigma_Fx,sigma_Fy,sigma_Fz,sigma_Mx,sigma_My,sigma_Mz) 
% and 6 columns (UF, UA, LF, LA, P, TR). Matrix is entirely unit vectors, and exists to distribute applied forces properly in the following steps.

Equilibrium_Solutions = zeros(number_of_load_cases, 9); % Final Table of forces. First 3 columns are acceleration loads and last 6 are each link's forces.

for i = 1:number_of_load_cases
    Equilibrium_Solutions(i, 1:3) = car_accel_mat(i, :); % Copies over the 12 load cases and their corresponding ax, ay, and az values
    
    % Applied moments from tire contact patch
    M_app = cross(r_app, F_app(i,:)); % Applied Mx My Moment is zero when we assume tire contact patch is the moment center, 
    % as all applied the forces act on the patch
    
    % b = -[Applied Forces; Applied Moments]
    b_vector = [-F_app(i,:)'; -M_app']; % Transposes and concatenates Force/Moment Matrices so that there are 6 rows (Fx, Fy, Fz, Mx, My, Mz) 
    % and 1 column for all the calculated external forces
    %b_vector is negative because using Force balance, suspension forces are equal to negative applied forces.

    % Solve for link forces (x)
    x = linsolve(A_matrix, b_vector); % Solves the linear system to find the 6 x 1 matrix with the force on each link. 
    % Projects the calculated external forces in B against the Suspension geometry in A to find the suspension forces in each link.
    
    Equilibrium_Solutions(i, 4:9) = x'; % Transposes the force solution for all 6 links onto the 12 load cases.
end

%% Upright FEA Forces 

% Because we do not like to overlap applied forces in FEA, we find the total upper and total lower forces along with their resultant vectors.

% Isolating magnitudes
upfore_F  = Equilibrium_Solutions(:, 4);
upaft_F   = Equilibrium_Solutions(:, 5);
lowfore_F = Equilibrium_Solutions(:, 6);
lowaft_F  = Equilibrium_Solutions(:, 7);
push_F    = Equilibrium_Solutions(:, 8);
tie_F     = Equilibrium_Solutions(:, 9);
% Projecting magnitudes onto unit vectors
upfore_vec  = upfore_F  .* F_sus_unit(1, :);
upaft_vec  = upaft_F   .* F_sus_unit(2, :);
lowfore_vec = lowfore_F .* F_sus_unit(3, :);
lowaft_vec  = lowaft_F  .* F_sus_unit(4, :);
push_vec    = push_F    .* F_sus_unit(5, :);
tie_vec   = tie_F    .* F_sus_unit(6, :);
% Summing force vectors
up_joint_vec  = upfore_vec + upaft_vec;
low_joint_vec = lowfore_vec + lowaft_vec;
up_joint_mag  = vecnorm(up_joint_vec, 2, 2);
low_joint_mag = vecnorm(low_joint_vec, 2, 2);

% Braking Force 
r_eff = 0.0965; % Distance from the center of the wheel to the center of the brake pads.

F_braking = F_app(:, 1); % Applied Longitudinal (Braking/Accel) Force. Braking Force will end up a bit overestimated because of the Fz_percent assumptions. 
% F_braking * r_tire = F_caliper * r_eff (Moment Balance)
F_caliper = abs(F_braking) .* (r_tire / r_eff); %This is only magnitude, make sure you angle it properly in the FEA (along the two brake tab holes)

% Steering Force
steering_force = Equilibrium_Solutions(:,9);

%% Formatting 
Link_Forces_Table = array2table(Equilibrium_Solutions, 'RowNames', {'brake','turn out','turn in','bump',...
    'brake turn out','brake turn in','brake bump','turn out bump', ...
    'turn in bump', 'brake turn out bump','brake turn in bump','at rest'},...
    'VariableNames', {'ax','ay','az','Up_Fore','Up_Aft','Low_Fore','Low_Aft','Push_Pull','Tie_Rod'});

format short g
FEA_Forces_Array = [Equilibrium_Solutions(:,1:3),up_joint_mag, up_joint_vec, low_joint_mag, low_joint_vec, steering_force, F_caliper];
FEA_Forces_Table = array2table(FEA_Forces_Array, 'RowNames', {'brake','turn out','turn in','bump',...
    'brake turn out','brake turn in','brake bump','turn out bump', ...
    'turn in bump', 'brake turn out bump','brake turn in bump','at rest'},...
    'VariableNames', {'ax', 'ay', 'az','Up_Mag','Up_X', 'Up_Y', 'Up_Z', 'Low_Mag','Low_X', 'Low_Y', 'Low_Z','Tie_Rod','Brake_Caliper'});

disp('Main Suspension Forces');
disp(Link_Forces_Table);
disp('Upright FEA Forces');
disp(FEA_Forces_Table);
```

<br>
