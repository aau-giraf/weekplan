import { useEffect, useState } from "react";
import { z } from "zod";

type UseValidationProps<T> = {
  //Zod schema based on the given formData type
  schema: z.Schema<T>;
  formData: T;
};

/**
 * Custom hook for validating form data against a Zod schema.
 * @param schema
 * @param formData
 * @returns {Object} An object containing the errors and the validity of the form data.
 * @returns {Object.errors} The errors object containing the validation errors.
 * @returns {Object.valid} A boolean indicating if the form data is valid.
 */

const useValidation = <T>({ schema, formData }: UseValidationProps<T>) => {
  type FormErrors = z.inferFormattedError<typeof schema>;

  //Zod errors managed by state
  const [errors, setErrors] = useState<FormErrors | null>(null);
  const [valid, setValid] = useState(false);

  //Check validation schema against formData every time formData changes
  useEffect(() => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.format());
      setValid(false);
    } else {
      setErrors(null);
      setValid(true);
    }
  }, [formData, schema]);

  return { errors, valid };
};

export default useValidation;
