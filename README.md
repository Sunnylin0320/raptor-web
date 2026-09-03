# RaPToR Web — Frontend

A browser-based redesign of the RaPToR Toolkit's teleoperation interface for the
iRobot Create 3, built with React. This replaces the original Python/Tkinter
desktop GUI (by Otto Chu) with a web application that runs in any modern
browser, on any device, with no installation required.

Part of the dissertation *"From Desktop to Browser: A Web-Based Redesign of
the RaPToR Robot Teleoperation Interface"* (Yung Chia Lin, MSc Computer
Science, University of Bath).

## Features

- **Movement Control** — on-screen keyboard-style button grid (Q/W/E, A/S/D,
  Z/X/C), gated behind a Start/Stop safety toggle
- **Sensor Monitoring** — subscribe to any of 35 ROS 2 sensor/status topics;
  hover any sensor for a description
- **Actions** — trigger the Create 3's 8 built-in behaviours (Dock, Undock,
  Rotate angle, Drive arc, Drive distance, Navigate, Audio sequence, LED
  animation) with a shared parameter field and a select-then-run flow
- **Terminal** — run arbitrary ROS 2 commands directly from the browser, with
  streamed output; also displays the auto-logged event history
- **Recording Management** — record, save, and replay sequences of actions
- **Switch Scene** — swap between pre-configured Gazebo simulation worlds
  from a dropdown in the header

## Requirements

- Node.js v22.15.0
- npm or yarn
- The backend bridge (`RaPToR-Toolkit-react`) running and reachable —
  see that repository's README for setup. This frontend will not function on
  its own; it depends on the two WebSocket connections the bridge exposes.

## Setup

```bash
git clone https://github.com/Sunnylin0320/raptor-web.git
cd raptor-web
npm install
```

## Running

```bash
npm run dev
```

By default the frontend expects the bridge's WebSocket servers at
`ws://localhost:6789` (sensor data) and `ws://localhost:6790` (control
commands). These are hardcoded, not configurable via environment variables —
if you need to point the frontend at a bridge running elsewhere, update these
values directly in the source.

Then open `http://localhost:5173` in your browser (Vite's default dev
server port).

## Project Structure

```
src/
  components/
    MovementControl/
    Actions/
    Terminal/
    Recording/
  ...
```

## Notes

- Developed and tested against an ARM64 Ubuntu virtual machine (Parallels
  Desktop on Apple Silicon) running the backend bridge and Gazebo.
- See the dissertation, Chapter 5 (Implementation and Testing), for
  implementation details, and Chapter 6 (Results) for the evaluation.

## Acknowledgements

Built on top of the original RaPToR Toolkit by Otto Chu (BSc project,
University of Bath).