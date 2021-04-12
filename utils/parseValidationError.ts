import { ValidationError } from 'joi';

export default function parseValidationError(
  error: ValidationError | undefined
): { [k: string]: string | string[] } {
  const msg = error
    ? error.details.reduce<{ [k: string]: string | string[] }>((acc, curr) => {
        const fieldname = curr.path[0].toString();
        if (curr.path.length === 2 && typeof curr.path[1] === 'number') {
          const msgs: string[] = (acc[fieldname] ?? []) as string[];
          msgs[curr.path[1]] = curr.message;
          return {
            ...acc,
            [fieldname]: msgs,
          };
        }
        return {
          ...acc,
          [fieldname]: curr.message,
        };
      }, {})
    : {};
  return msg;
}
