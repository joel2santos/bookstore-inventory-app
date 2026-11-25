import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { ApiError, bookRepository } from "@data";
import type {
  BookFormValues,
  BookInput,
  BookValidationErrors,
} from "@domain";
import { Button, Skeleton, Text } from "@presentation/components";
import { AppRoutes, bookDetailPath } from "@presentation/router/routes";
import { BookForm } from "./components/BookForm";

const FIELD_MAP: Record<string, keyof BookFormValues> = {
  title: "title",
  author: "author",
  category: "category",
  isbn: "isbn",
  supplier_country: "supplierCountry",
  cost_usd: "costUsd",
  stock_quantity: "stockQuantity",
};

function mapServerErrors(err: ApiError): BookValidationErrors {
  const mapped: BookValidationErrors = {};
  for (const [key, messages] of Object.entries(err.fieldErrors)) {
    const formKey = FIELD_MAP[key];
    if (formKey && messages.length > 0) {
      mapped[formKey] = messages[0];
    }
  }
  return mapped;
}

const _BookFormBody = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const bookId = id ? Number(id) : null;

  const [initialValues, setInitialValues] = useState<
    BookFormValues | undefined
  >(undefined);
  const [isLoadingBook, setIsLoadingBook] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<BookValidationErrors>({});

  useEffect(() => {
    if (!isEditMode || bookId === null || Number.isNaN(bookId)) {
      setIsLoadingBook(false);
      return;
    }

    const controller = new AbortController();
    setIsLoadingBook(true);

    bookRepository
      .getById(bookId, controller.signal)
      .then((book) => {
        setInitialValues({
          title: book.title,
          author: book.author,
          category: book.category,
          isbn: book.isbn,
          supplierCountry: book.supplierCountry,
          costUsd: String(book.costUsd),
          stockQuantity: String(book.stockQuantity),
        });
        setIsLoadingBook(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        toast.error(
          err instanceof Error ? err.message : "Failed to load book for editing",
        );
        navigate(AppRoutes.HOME);
      });

    return () => controller.abort();
  }, [isEditMode, bookId, navigate]);

  const handleSubmit = async (input: BookInput) => {
    setIsSubmitting(true);
    setServerErrors({});

    try {
      const saved =
        isEditMode && bookId !== null
          ? await bookRepository.update(bookId, input)
          : await bookRepository.create(input);

      toast.success(
        isEditMode ? "Book updated successfully" : "Book added to inventory",
      );
      navigate(bookDetailPath(saved.id));
    } catch (err) {
      if (err instanceof ApiError) {
        setServerErrors(mapServerErrors(err));
        toast.error(err.message);
      } else {
        toast.error("Failed to save book");
      }
      setIsSubmitting(false);
    }
  };

  const backPath =
    isEditMode && bookId !== null ? bookDetailPath(bookId) : AppRoutes.HOME;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate(backPath)}
          className="-ml-2 mb-2"
        >
          Back
        </Button>
        <Text variant="h1">
          {isEditMode ? "Edit Book" : "Add New Book"}
        </Text>
        <Text variant="body" tone="muted" className="mt-1">
          {isEditMode
            ? "Update book details and inventory counts."
            : "Register a new book with validated ISBN and USD cost."}
        </Text>
      </div>

      {isLoadingBook ? (
        <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="ml-auto h-10 w-32" />
        </div>
      ) : (
        <BookForm
          key={isEditMode ? `edit-${bookId}` : "create"}
          initialValues={initialValues}
          serverErrors={serverErrors}
          submitLabel={isEditMode ? "Save Changes" : "Create Book"}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate(backPath)}
        />
      )}
    </div>
  );
};

export default _BookFormBody;
