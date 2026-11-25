# Bookstore Inventory App

## Stack Used

- **Core:** React 19, TypeScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4, Lucide React
- **State Management:** Zustand
- **Notifications:** React Hot Toast
- **Build Tool:** Vite
- **Testing:** Vitest, React Testing Library, JSDOM
- **Containers:** Docker, Docker Compose

---

## Installation

Make sure you have **Node.js** (v18+) and **pnpm** installed.

1. Clone the repository:
   ```bash
   git clone github.com/joel2santos/bookstore-inventory-app.git
   cd bookstore-inventory-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

---

## Execution

### Development Mode
Start the Vite development server:
```bash
pnpm dev
```
Open your browser at `http://localhost:5173`.

### Production Build
Build the application for production:
```bash
pnpm build
```

To preview the production build locally:
```bash
pnpm preview
```

### Docker
Using Docker Compose:
```bash
docker compose up --build -d
```

---

## Tests

The project uses Vitest and React Testing Library for unit and component testing.

- **Run tests once:**
  ```bash
  pnpm test
  ```

- **Run tests in watch mode:**
  ```bash
  pnpm test:watch
  ```

- **Run test coverage:**
  ```bash
  pnpm test:coverage
  ```
