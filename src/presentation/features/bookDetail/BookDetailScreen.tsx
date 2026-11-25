import type { AppRoute } from "@presentation";
import _BookDetailBody from "./BookDetailBody";

const PATHNAME = "books/:id";

const BookDetailScreen = () => {
  return <_BookDetailBody />;
};

BookDetailScreen.appRoute = {
  name: "book-detail",
  path: `/${PATHNAME}`,
  element: <BookDetailScreen />,
} as AppRoute;

export default BookDetailScreen;
