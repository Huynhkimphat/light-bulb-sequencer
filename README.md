# Light Bulb Sequencer

An interactive, high-performance React/Next.js application to play, configure, and share animated light-bulb sequences. Built with a focus on modern development patterns and visual excellence.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **Package Manager**: `npm` or `yarn`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd light-bulb-sequencer

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 🧪 Testing

The project uses **Vitest** for unit and integration testing.

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch
```

## ✨ Features

| Feature               | Description                                                            |
| :-------------------- | :--------------------------------------------------------------------- |
| **3 Dynamic Bulbs**   | Animated with smooth CSS transitions and pulse effects.                |
| **Custom Colors**     | Real-time color modification via integrated pickers.                   |
| **Sound Engine**      | Synthesized tones per bulb using the Web Audio API.                    |
| **Flexible Playback** | Control repetitions (1–99), direction, and step duration (200ms – 2s). |
| **Persistence**       | Import and export your sequences as human-readable JSON files.         |
| **Responsive Design** | Optimized for desktop and mobile viewports.                            |

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Audio**: Web Audio API

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Layouts & Pages)
├── components/           # React Components (BulbStage, ControlPanel, etc.)
├── lib/                  # Core Logic (Audio Engine, Config I/O, Sequencer Logic)
├── store/                # Zustand State Management
├── types/                # TypeScript Definitions
└── hooks/                # Custom React Hooks
```

## 🧠 Design Philosophy

### Centralized State with Zustand

The application utilizes **Zustand** for state management, replacing the initial `useReducer` approach. This allows for:

- **Global Accessibility**: State can be accessed or modified from any component without prop-drilling.
- **Decoupled Logic**: Playback orchestration and state transitions are handled outside of the React render cycle where appropriate.
- **Performance**: Fine-grained subscriptions ensure components only re-render when their specific subset of state changes.

### Atomic UI Components

Components are designed to be "Server-first" and reusable. Interactivity is isolated to specific "Client Components" (`ControlPanel`, `ImportExport`), while display components like `LightBulb` and `BulbStage` remain lightweight.

### Reliable Config I/O

Configuration persistence is handled via JSON. The application includes a robust validation layer to ensure that imported configurations meet the expected schema, providing clear feedback on errors.

### Resilient Audio Engine

The `audioEngine.ts` wrapper handles browser restrictions on `AudioContext` usage and ensures that tests run smoothly even in environments without hardware audio support.

## 📝 License

This project is licensed under the MIT License.
