import React, { lazy } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { FallbackScreen, Layout } from "../components";
import { AppRoutes } from "./routes";

const InventoryScreen = lazy(
  () => import("../features/inventory/InventoryScreen"),
);
const BookDetailScreen = lazy(
  () => import("../features/bookDetail/BookDetailScreen"),
);
const BookFormScreen = lazy(
  () => import("../features/bookForm/BookFormScreen"),
);

class _AppRouter {
  private get _routes(): AppRoute[] {
    return [
      {
        name: "",
        path: AppRoutes.INVENTORY,
        element: React.createElement(InventoryScreen),
      },
      {
        name: "book-create",
        path: AppRoutes.BOOK_CREATE,
        element: React.createElement(BookFormScreen),
      },
      {
        name: "book-detail",
        path: AppRoutes.BOOK_DETAIL,
        element: React.createElement(BookDetailScreen),
      },
      {
        name: "book-edit",
        path: AppRoutes.BOOK_EDIT,
        element: React.createElement(BookFormScreen),
      },
    ];
  }

  get router() {
    return createBrowserRouter([
      {
        path: "/",
        element: React.createElement(Layout),
        errorElement: React.createElement(FallbackScreen),
        children: this._routes as unknown as RouteObject[],
      },
    ]);
  }
}

export type AppRoute = {
  name: string;
  path: string;
  index?: boolean;
  element: React.ReactElement;
  errorElement?: React.ReactNode;
  children?: AppRoute[];
};

export const appRouter = new _AppRouter();
