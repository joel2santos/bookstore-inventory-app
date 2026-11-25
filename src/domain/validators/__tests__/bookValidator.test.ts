import { describe, it, expect } from "vitest";
import {
  validateIsbn,
  validateBookInput,
  type BookFormValues,
} from "@domain/validators/bookValidator";

// ─── validateIsbn ────────────────────────────────────────────────────────────

describe("validateIsbn", () => {
  describe("ISBN-13", () => {
    it("accepts a valid ISBN-13", () => {
      expect(validateIsbn("978-84-376-0494-7")).toBeNull();
    });

    it("accepts a valid ISBN-13 without hyphens", () => {
      expect(validateIsbn("9780306406157")).toBeNull();
    });

    it("rejects an ISBN-13 with a wrong check digit", () => {
      expect(validateIsbn("9780306406158")).toMatch(/check digit/i);
    });
  });

  describe("ISBN-10", () => {
    it("accepts a valid ISBN-10", () => {
      expect(validateIsbn("0-306-40615-2")).toBeNull();
    });

    it("accepts a valid ISBN-10 ending in X", () => {
      // 0-306-40615-2 rewritten: use 0-306-40615-2 (check=2), or a known X isbn
      // ISBN-10: 0-19-852663-X → digits: 0198526630X
      // total = 0*10+1*9+9*8+8*7+5*6+2*5+6*4+6*3+3*2 = 0+9+72+56+30+10+24+18+6 = 225, check X=10 → 235%11=235-209=26→26%11=4 ≠ 0
      // Use verified: ISBN "0-201-53082-1" ends in 1; for X: "0-201-63382-X"? Use safe known one:
      // "0-8044-2957-X": 0*10+8*9+0*8+4*7+4*6+2*5+9*4+5*3+7*2 = 0+72+0+28+24+10+36+15+14=199, 199+10=209, 209/11=19, 209%11=0 ✓
      expect(validateIsbn("0-8044-2957-X")).toBeNull();
    });

    it("rejects an ISBN-10 with a wrong check digit", () => {
      expect(validateIsbn("0306406153")).toMatch(/check digit/i);
    });
  });

  describe("invalid inputs", () => {
    it("rejects an empty value", () => {
      expect(validateIsbn("")).toMatch(/required/i);
    });

    it("rejects a value that is neither ISBN-10 nor ISBN-13", () => {
      expect(validateIsbn("12345")).toMatch(/valid isbn/i);
    });

    it("rejects a 13-digit value with non-digit characters", () => {
      expect(validateIsbn("978-84-376-XXXX-X")).toMatch(/valid isbn/i);
    });
  });
});

// ─── validateBookInput ───────────────────────────────────────────────────────

function makeValues(overrides: Partial<BookFormValues> = {}): BookFormValues {
  return {
    title: "El Quijote",
    author: "Cervantes",
    category: "Literatura Clásica",
    isbn: "978-84-376-0494-7",
    supplierCountry: "ES",
    costUsd: "15.99",
    stockQuantity: "25",
    ...overrides,
  };
}

describe("validateBookInput", () => {
  it("returns no errors for a valid input", () => {
    expect(validateBookInput(makeValues())).toEqual({});
  });

  it("requires title", () => {
    const errors = validateBookInput(makeValues({ title: "" }));
    expect(errors.title).toBeTruthy();
  });

  it("requires author", () => {
    const errors = validateBookInput(makeValues({ author: "   " }));
    expect(errors.author).toBeTruthy();
  });

  it("requires category", () => {
    const errors = validateBookInput(makeValues({ category: "" }));
    expect(errors.category).toBeTruthy();
  });

  it("propagates ISBN error", () => {
    // "0000000001" is NOT a valid ISBN-10: 0+0+0+0+0+0+0+0+0*2=0, check=1, 1%11≠0
    const errors = validateBookInput(makeValues({ isbn: "0000000001" }));
    expect(errors.isbn).toBeTruthy();
  });

  it("requires supplierCountry", () => {
    const errors = validateBookInput(makeValues({ supplierCountry: "" }));
    expect(errors.supplierCountry).toBeTruthy();
  });

  it("rejects a supplierCountry longer than 3 chars", () => {
    const errors = validateBookInput(makeValues({ supplierCountry: "ESPA" }));
    expect(errors.supplierCountry).toBeTruthy();
  });

  it("requires costUsd to be > 0", () => {
    expect(validateBookInput(makeValues({ costUsd: "0" })).costUsd).toBeTruthy();
    expect(validateBookInput(makeValues({ costUsd: "-5" })).costUsd).toBeTruthy();
  });

  it("requires costUsd to be a valid number", () => {
    const errors = validateBookInput(makeValues({ costUsd: "abc" }));
    expect(errors.costUsd).toBeTruthy();
  });

  it("requires stockQuantity >= 0", () => {
    const errors = validateBookInput(makeValues({ stockQuantity: "-1" }));
    expect(errors.stockQuantity).toBeTruthy();
  });

  it("accepts stockQuantity of 0", () => {
    const errors = validateBookInput(makeValues({ stockQuantity: "0" }));
    expect(errors.stockQuantity).toBeUndefined();
  });

  it("requires stockQuantity to be an integer", () => {
    const errors = validateBookInput(makeValues({ stockQuantity: "2.5" }));
    expect(errors.stockQuantity).toBeTruthy();
  });

  it("collects multiple errors at once", () => {
    const errors = validateBookInput(
      makeValues({ title: "", author: "", costUsd: "-1" }),
    );
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(3);
  });
});
