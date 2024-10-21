import { z } from "zod";
import useValidation from "../hooks/useValidation";
import { renderHook } from "@testing-library/react-native";

const schema = z.object({
  title: z.string().trim().min(1, "Du skal have en titel"),
  description: z.string().trim().min(1, "Du skal have en beskrivelse"),
});

type FormData = z.infer<typeof schema>;

describe("useValidation hook", () => {
  test("returns valid if the form data is valid", () => {
    const mockData: FormData = { title: "Title", description: "Beskrivelse" };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema })
    );
    expect(result.current.valid).toBe(true);
  });

  test("returns errors if the form data is invalid", () => {
    const mockData: FormData = { title: "", description: "" };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema })
    );
    expect(result.current.valid).toBe(false);
    expect(result.current.errors?.title?._errors).toEqual([
      "Du skal have en titel",
    ]);
    expect(result.current.errors?.description?._errors).toEqual([
      "Du skal have en beskrivelse",
    ]);
  });
  test("returns errors for invalid fields when only one is invalid", () => {
    const mockData: FormData = { title: "Title", description: "" };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema })
    );
    expect(result.current.valid).toBe(false);
    expect(result.current.errors?.title?._errors).toBeUndefined();
    expect(result.current.errors?.description?._errors).toEqual([
      "Du skal have en beskrivelse",
    ]);
  });
  test("returns errors for non-string inputs", () => {
    const mockData: FormData = {
      title: 123 as unknown as string,
      description: null as unknown as string,
    };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema })
    );
    expect(result.current.valid).toBe(false);
    expect(result.current.errors?.title?._errors).toEqual([
      "Expected string, received number",
    ]);
    expect(result.current.errors?.description?._errors).toEqual([
      "Expected string, received null",
    ]);
  });

  test("Testing refine function returns expected output false", () => {
    const customValid = (val: number) => (val > 5 ? true : false);
    const schema2 = z.object({
      value: z
        .number()
        .refine(customValid, { message: "Value must be greater than 5" }),
    });
    type FormData2 = z.infer<typeof schema2>;
    const mockData: FormData2 = { value: 4 };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema: schema2 })
    );

    expect(result.current.valid).toBe(false);
  });

  test("Testing refine function returns expected output true", () => {
    const customValid = (val: number) => (val > 5 ? true : false);
    const schema2 = z.object({
      value: z
        .number()
        .refine(customValid, { message: "Value must be greater than 5" }),
    });
    type FormData2 = z.infer<typeof schema2>;
    const mockData: FormData2 = { value: 6 };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema: schema2 })
    );

    expect(result.current.valid).toBe(true);
  });
  test("returns errors for whitespace-only input", () => {
    const mockData: FormData = { title: "   ", description: "   " };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema })
    );
    expect(result.current.valid).toBe(false);
    expect(result.current.errors?.title?._errors).toEqual([
      "Du skal have en titel",
    ]);
    expect(result.current.errors?.description?._errors).toEqual([
      "Du skal have en beskrivelse",
    ]);
  });
});
