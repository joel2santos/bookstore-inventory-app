import React, { useState } from "react";
import {
  Barcode,
  BookOpen,
  DollarSign,
  Globe,
  Package,
  Save,
  Tag,
  User,
} from "lucide-react";
import {
  validateBookInput,
  type BookFormValues,
  type BookInput,
  type BookValidationErrors,
} from "@domain";
import { Button, Field } from "@presentation/components";

export interface BookFormProps {
  initialValues?: BookFormValues;
  serverErrors?: BookValidationErrors;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (input: BookInput) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_VALUES: BookFormValues = {
  title: "",
  author: "",
  category: "",
  isbn: "",
  supplierCountry: "",
  costUsd: "",
  stockQuantity: "0",
};

export const BookForm: React.FC<BookFormProps> = ({
  initialValues = DEFAULT_VALUES,
  serverErrors = {},
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<BookFormValues>(initialValues);
  const [errors, setErrors] = useState<BookValidationErrors>({});

  const mergedErrors: BookValidationErrors = { ...serverErrors, ...errors };

  const handleChange =
    (field: keyof BookFormValues) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const next = e.target.value;
      setValues((prev) => ({ ...prev, [field]: next }));
      if (errors[field]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[field];
          return copy;
        });
      }
    };

  const handleBlur = (field: keyof BookFormValues) => () => {
    const fieldErrors = validateBookInput(values);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateBookInput(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit({
      title: values.title.trim(),
      author: values.author.trim(),
      category: values.category.trim(),
      isbn: values.isbn.trim(),
      supplierCountry: values.supplierCountry.trim().toUpperCase(),
      costUsd: Number(values.costUsd),
      stockQuantity: Number(values.stockQuantity),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-stone-200 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          name="title"
          label="Title"
          placeholder="e.g. El Quijote"
          value={values.title}
          onChange={handleChange("title")}
          onBlur={handleBlur("title")}
          leftIcon={<BookOpen className="h-4 w-4" />}
          error={mergedErrors.title}
          required
          className="sm:col-span-2"
        />

        <Field
          name="author"
          label="Author"
          placeholder="e.g. Miguel de Cervantes"
          value={values.author}
          onChange={handleChange("author")}
          onBlur={handleBlur("author")}
          leftIcon={<User className="h-4 w-4" />}
          error={mergedErrors.author}
          required
        />

        <Field
          name="category"
          label="Category"
          placeholder="e.g. Literatura Clásica"
          value={values.category}
          onChange={handleChange("category")}
          onBlur={handleBlur("category")}
          leftIcon={<Tag className="h-4 w-4" />}
          error={mergedErrors.category}
          required
        />

        <Field
          name="isbn"
          label="ISBN (10 or 13)"
          placeholder="e.g. 978-84-376-0494-7"
          value={values.isbn}
          onChange={handleChange("isbn")}
          onBlur={handleBlur("isbn")}
          leftIcon={<Barcode className="h-4 w-4" />}
          error={mergedErrors.isbn}
          hint="Hyphens and spaces allowed; check digit is validated."
          required
        />

        <Field
          name="supplierCountry"
          label="Supplier Country"
          placeholder="e.g. ES, US, GB"
          value={values.supplierCountry}
          onChange={handleChange("supplierCountry")}
          onBlur={handleBlur("supplierCountry")}
          leftIcon={<Globe className="h-4 w-4" />}
          error={mergedErrors.supplierCountry}
          hint="2- or 3-letter ISO country code."
          required
        />

        <Field
          name="costUsd"
          type="number"
          label="Cost (USD)"
          placeholder="15.99"
          min="0.01"
          step="0.01"
          value={values.costUsd}
          onChange={handleChange("costUsd")}
          onBlur={handleBlur("costUsd")}
          leftIcon={<DollarSign className="h-4 w-4" />}
          error={mergedErrors.costUsd}
          required
        />

        <Field
          name="stockQuantity"
          type="number"
          label="Stock Quantity"
          placeholder="25"
          min="0"
          step="1"
          value={values.stockQuantity}
          onChange={handleChange("stockQuantity")}
          onBlur={handleBlur("stockQuantity")}
          leftIcon={<Package className="h-4 w-4" />}
          error={mergedErrors.stockQuantity}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-5">
        <Button
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
