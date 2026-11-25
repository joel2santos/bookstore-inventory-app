import type { AppRoute } from "@presentation";
import _InventoryBody from "./InventoryBody";

const PATHNAME = "";

const InventoryScreen = () => {
  return <_InventoryBody />;
};

InventoryScreen.appRoute = {
  name: PATHNAME,
  path: `/${PATHNAME}`,
  element: <InventoryScreen />,
} as AppRoute;

export default InventoryScreen;
