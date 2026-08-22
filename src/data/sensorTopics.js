export const SENSOR_TOPICS = [
  {
    topic: "/battery_state",
    description: "Battery charge level",
    displayType: "percentage",
    max: 100,
  },
  {
    topic: "/dock_status",
    description: "Whether the robot is currently docked",
    displayType: "status",
    goodValues: ["Docked"],
  },
  {
    topic: "/hazard_detection",
    description: "Collision, cliff, and other hazard detections",
  },
  {
    topic: "/interface_buttons",
    description: "Physical faceplate button press events",
  },
  {
    topic: "/ir_intensity",
    description: "IR proximity sensor readings (obstacle avoidance)",
  },
  {
    topic: "/ir_opcode",
    description: "IR signal codes (dock beacon, virtual wall)",
  },
  {
    topic: "/kidnap_status",
    description: "Whether the robot has been picked up unexpectedly",
    displayType: "status",
    goodValues: ["Normal"],
  },
  { topic: "/mouse", description: "Optical displacement sensor" },
  {
    topic: "/odom",
    description: "Estimated position/velocity from wheel odometry",
  },
  {
    topic: "/slip_status",
    description: "Whether the wheels are slipping",
    displayType: "status",
    goodValues: ["Normal"],
  },
  {
    topic: "/stop_status",
    description: "Whether the robot is stopped or moving",
    displayType: "status",
    goodValues: ["Moving"],
  },
  {
    topic: "/wheel_status",
    description: "Wheel enable state and current draw",
  },
  { topic: "/wheel_ticks", description: "Raw wheel encoder tick counts" },
  { topic: "/wheel_vels", description: "Current wheel velocities" },
  { topic: "/cmd_vel", description: "Currently commanded velocity" },
  {
    topic: "/cmd_audio",
    description:
      "Audio note command (no active publisher in current sim config; superseded by the audio_note_sequence Action)",
  },
  {
    topic: "/cmd_lightring",
    description:
      "LED lightring command (no active publisher in current sim config; superseded by the led_animation Action)",
  },
  {
    topic: "/bumper_contact",
    description: "Number of simulated bumper contact events",
  },
  { topic: "/clock", description: "Current simulation time" },
  {
    topic: "/sim_ground_truth_pose",
    description:
      "Exact simulator-known robot position (for comparison against /odom)",
  },
  {
    topic: "/sim_ground_truth_dock_pose",
    description: "Exact simulator-known dock position",
  },
  {
    topic: "/diffdrive_controller/cmd_vel_unstamped",
    description:
      "Low-level velocity command actually received by the diffdrive controller",
  },
  { topic: "/clicked_point", description: "Last point clicked in RViz" },
  { topic: "/goal_pose", description: "Last navigation goal set in RViz" },
  {
    topic: "/initialpose",
    description: "Last initial pose manually set in RViz",
  },
  {
    topic: "/robot_description",
    description: "Robot's URDF model description",
  },
  {
    topic: "/standard_dock_description",
    description: "Charging dock's URDF description",
  },
  {
    topic: "/joint_states",
    description: "Joint angles/velocities for visualization",
  },
  {
    topic: "/dynamic_joint_states",
    description: "Extended joint state information",
  },
  { topic: "/tf", description: "Dynamic coordinate transforms" },
  { topic: "/tf_static", description: "Static coordinate transforms" },
  {
    topic: "/parameter_events",
    description: "Notification that a node's parameters changed",
  },
  { topic: "/rosout", description: "ROS 2 system log messages" },
  {
    topic: "/joint_state_broadcaster/transition_event",
    description: "Lifecycle transitions for this controller",
    displayType: "status",
    goodValues: ["active"],
  },
  {
    topic: "/diffdrive_controller/transition_event",
    description: "Lifecycle transitions for this controller",
    displayType: "status",
    goodValues: ["active"],
  },
];
