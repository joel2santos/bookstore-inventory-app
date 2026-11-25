import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { appRouter, ErrorBoundary } from "@presentation";

const App = () => {
  const router = appRouter.router;

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: "0.875rem",
            borderRadius: "0.75rem",
            border: "1px solid #e7e5e4",
          },
        }}
      />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
