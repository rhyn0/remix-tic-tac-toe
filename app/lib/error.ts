import type { z } from "zod";
/**
 * Extract Zod errors from SafeParse
 */
export function formatZodError<T extends object>(
    parsed: z.SafeParseError<T>,
): Partial<Record<keyof T, string>> {
    return parsed.error.errors.reduce(
        (errors, issue) => {
            const issuePath = issue.path.join(".");
            errors[issuePath as keyof T] = issue.message;
            return errors;
        },
        {} as Record<keyof T, string>,
    );
}
