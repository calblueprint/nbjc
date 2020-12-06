import { ValidationError } from 'joi';

export default function parseValidationError(
  error: ValidationError | undefined
): { [k: string]: string } {
  const msg: { [k: string]: string } = error
    ? error.details.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.path[0]]: curr.message,
        }),
        {}
      )
    : {};
  return msg;
}
