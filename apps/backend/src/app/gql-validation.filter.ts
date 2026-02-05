import { Catch, BadRequestException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(BadRequestException)
export class GqlValidationFilter implements GqlExceptionFilter {
  catch(exception: BadRequestException) {
    const response = exception.getResponse() as any;

    return new GraphQLError(response?.message ?? 'Validation failed', {
      extensions: {
        code: 'BAD_REQUEST',
        fields: response?.fields,
      },
    });
  }
}
