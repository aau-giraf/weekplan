import { z } from "zod";
import useValidation from "../hooks/useValidation";
import { renderHook } from "@testing-library/react-native";

const schema = z.object({
  title: z.string().min(1, "Du skal have en titel"),
  description: z.string().min(1, "Du skal have en beskrivelse"),
});

type FormData = z.infer<typeof schema>;

describe("useValidation hook", () => {
  test("returns valid if the form data is valid", () => {
    const mockData: FormData = { title: "Title", description: "Beskrivelse" };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema }),
    );
    expect(result.current.valid).toBe(true);
  });

  test("returns errors if the form data is invalid", () => {
    const mockData: FormData = { title: "", description: "" };
    const { result } = renderHook(() =>
      useValidation({ formData: mockData, schema }),
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
      useValidation({ formData: mockData, schema }),
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
      useValidation({ formData: mockData, schema }),
    );
    expect(result.current.valid).toBe(false);
    expect(result.current.errors?.title?._errors).toEqual([
      "Expected string, received number",
    ]);
    expect(result.current.errors?.description?._errors).toEqual([
      "Expected string, received null",
    ]);
  });
});
