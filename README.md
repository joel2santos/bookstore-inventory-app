# Aplicación de Inventario de Librería

## Stack Utilizado

- **Núcleo:** React 19, TypeScript
- **Enrutamiento:** React Router v7
- **Estilos:** Tailwind CSS v4, Lucide React
- **Gestión de Estado:** Zustand
- **Notificaciones:** React Hot Toast
- **Herramienta de Compilación:** Vite
- **Pruebas:** Vitest, React Testing Library, JSDOM
- **Contenedores:** Docker, Docker Compose

---

## Instalación

Asegúrate de tener **Node.js** (v18+) y **pnpm** instalados.

1. Clona el repositorio:
   ```bash
   git clone github.com/joel2santos/bookstore-inventory-app.git
   cd bookstore-inventory-app
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

---

## Ejecución

### Modo Desarrollo
Inicia el servidor de desarrollo de Vite:
```bash
pnpm dev
```
Abre tu navegador en `http://localhost:5173`.

### Compilación de Producción
Construye la aplicación para producción:
```bash
pnpm build
```

Para previsualizar la compilación de producción localmente:
```bash
pnpm preview
```

### Docker
Usando Docker Compose:
```bash
docker compose up --build -d
```

---

## Pruebas

El proyecto utiliza Vitest y React Testing Library para pruebas unitarias y de componentes.

- **Ejecutar las pruebas una vez:**
  ```bash
  pnpm test
  ```

- **Ejecutar pruebas en modo de observación (watch):**
  ```bash
  pnpm test:watch
  ```

- **Ejecutar cobertura de pruebas:**
  ```bash
  pnpm test:coverage
  ```
