import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { AppRoutes } from "../../router/routes";
import { Button, Text } from "../atoms";

export const FallbackScreen: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
        <Compass className="h-5 w-5" />
      </div>
      <Text variant="h2" className="mt-4">
        Page not found
      </Text>
      <Text variant="body" tone="muted" className="mt-1 max-w-sm">
        The page you requested does not exist or could not be loaded.
      </Text>
      <Link to={AppRoutes.HOME} className="mt-5">
        <Button
          variant="secondary"
          size="md"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Inventory
        </Button>
      </Link>
    </div>
  );
};
