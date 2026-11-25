import React, { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { BookMarked, Plus } from "lucide-react";
import { AppRoutes } from "../../router/routes";
import { Button, Skeleton, Text } from "../atoms";

const RouteFallback: React.FC = () => (
  <div className="space-y-4 py-6">
    <Skeleton className="h-8 w-56" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-44 w-full" />
    </div>
  </div>
);

export const Layout: React.FC = () => {
  const location = useLocation();
  const isCreatePage = location.pathname === AppRoutes.BOOK_CREATE;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to={AppRoutes.HOME}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-amber-300">
              <BookMarked className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <Text variant="subtitle" as="span" className="block leading-tight">
                Bookstore Inventory
              </Text>
              <Text variant="caption" tone="muted" className="block leading-tight">
                Catalog & Pricing
              </Text>
            </div>
          </Link>

          {!isCreatePage && (
            <Link to={AppRoutes.BOOK_CREATE}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                New Book
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
