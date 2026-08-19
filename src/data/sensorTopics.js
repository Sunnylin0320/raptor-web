// List of all ROS 2 topics available from the Create 3 robot / Gazebo simulation.
// This mirrors the dynamic topic discovery behavior of the original Tkinter RaPToR GUI,
// where topics are listed as toggleable checkboxes and only enabled ones are subscribed to.
//
// displayType controls how SensorStatusCard renders the value:
// "percentage" shows a progress bar (0-max range); omitted/"text" shows plain text.

export const SENSOR_TOPICS = [
  {
    topic: "/battery_state",
    description: "Battery level, voltage, current, temperature",
    displayType: "percentage",
    max: 100,
  },
  { topic: "/dock_status", description: "Dock detection / docking status" },
  {
    topic: "/hazard_detection",
    description: "Collision, cliff, and other hazard detection",
  },
  { topic: "/interface_buttons", description: "Physical button press events" },
  {
    topic: "/ir_intensity",
    description: "IR proximity sensor readings (obstacle avoidance)",
    displayType: "percentage",
    max: 4095,
  },
  {
    topic: "/ir_opcode",
    description: "IR signal codes (dock detection, virtual walls)",
  },
  {
    topic: "/kidnap_status",
    description: "Whether the robot has been picked up / moved",
  },
  { topic: "/mouse", description: "Optical displacement sensor" },
  {
    topic: "/odom",
    description: "Estimated position/velocity from wheel odometry",
  },
  { topic: "/slip_status", description: "Wheel slip detection" },
  {
    topic: "/stop_status",
    description: "Whether the robot is currently stopped",
  },
  { topic: "/wheel_status", description: "Overall wheel status" },
  { topic: "/wheel_ticks", description: "Raw wheel encoder tick counts" },
  { topic: "/wheel_vels", description: "Current wheel velocities" },

  // --- Control command topics (input, not sensor output) ---
  { topic: "/cmd_vel", description: "Velocity command (linear/angular)" },
  { topic: "/cmd_audio", description: "Audio note command" },
  {
    topic: "/cmd_lightring",
    description: "LED lightring color/animation command",
  },

  // --- Gazebo simulation-only topics ---
  { topic: "/bumper_contact", description: "Simulated bumper contact event" },
  { topic: "/clock", description: "Simulation clock (sim time)" },
  {
    topic: "/sim_ground_truth_pose",
    description: "Ground truth robot pose in simulation",
  },
  {
    topic: "/sim_ground_truth_dock_pose",
    description: "Ground truth dock pose in simulation",
  },
  {
    topic: "/diffdrive_controller/cmd_vel_unstamped",
    description: "Low-level velocity command used by diffdrive_controller",
  },

  // --- RViz user interaction inputs ---
  { topic: "/clicked_point", description: "Point clicked in RViz" },
  { topic: "/goal_pose", description: "Navigation goal set in RViz" },
  { topic: "/initialpose", description: "Initial pose set manually in RViz" },

  // --- Robot model description (static, not real-time sensor data) ---
  {
    topic: "/robot_description",
    description: "URDF model description of the robot",
  },
  {
    topic: "/standard_dock_description",
    description: "Model description of the charging dock",
  },
  {
    topic: "/joint_states",
    description: "Joint angles/velocities for RViz visualization",
  },
  {
    topic: "/dynamic_joint_states",
    description: "Extended joint state information",
  },

  // --- ROS 2 system-level topics ---
  { topic: "/tf", description: "Dynamic transform tree" },
  { topic: "/tf_static", description: "Static transform tree" },
  {
    topic: "/parameter_events",
    description: "ROS 2 parameter change notifications",
  },
  { topic: "/rosout", description: "ROS 2 system log messages" },
  {
    topic: "/joint_state_broadcaster/transition_event",
    description: "Lifecycle transition events for joint_state_broadcaster",
  },
  {
    topic: "/diffdrive_controller/transition_event",
    description: "Lifecycle transition events for diffdrive_controller",
  },
];
