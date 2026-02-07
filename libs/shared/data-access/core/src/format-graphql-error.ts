import { HttpErrorResponse } from '@angular/common/http';
import { FieldTree } from '@angular/forms/signals';
import { CombinedGraphQLErrors } from '@apollo/client';

export const formatGraphqlError = (e: any, fieldTree: FieldTree<unknown>) => {
  const errorMessage = (e as HttpErrorResponse).message;
  const validationErrors = [
    {
      fieldTree: fieldTree,
      kind: 'server',
      message: errorMessage || 'An error occurred',
    },
  ];
  const combinedGraphQLErrors = (e as CombinedGraphQLErrors).errors;
  combinedGraphQLErrors?.forEach((error: any) => {
    if (error?.['extensions']?.['code'] === 'BAD_REQUEST') {
      error?.['extensions']?.['fields']?.forEach(
        ({ field, message }: { field: string; message: string }) => {
          validationErrors.push({
            fieldTree: (fieldTree as any)[field],
            kind: field,
            message: message,
          });
        },
      );
    }
  });

  console.log(validationErrors);

  return validationErrors;
};
