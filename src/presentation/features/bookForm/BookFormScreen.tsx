import type { AppRoute } from "@presentation";
import _BookFormBody from "./BookFormBody";

const PATHNAME = "books/new";

const BookFormScreen = () => {
  return <_BookFormBody />;
};

BookFormScreen.appRoute = {
  name: "book-create",
  path: `/${PATHNAME}`,
  element: <BookFormScreen />,
} as AppRoute;

export default BookFormScreen;
