import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { QueryOperatorEnum, SortByDirectionEnum } from '@fsms/backend/db';
import { AuthServiceBackend } from '@fsms/backend/auth-service';

@Injectable()
export class InstitutionGuard implements CanActivate {
  constructor(
    private readonly institutionBackendService: InstitutionBackendService,
    private readonly authService: AuthServiceBackend,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const institutionId = req.headers['x-institution-id'];
    if (institutionId) {
      req['institutionId'] = institutionId;
      return true;
    }

    let user = req.user as { id: string } | undefined;
    const authHeader = req.headers['authorization'];

    if (!user?.id && authHeader) {
      const token = this.extractToken(authHeader);
      if (!token)
        throw new BadRequestException('Invalid authorization header format');

      const extractedUser = await this.authService.validateToken(token);
      if (extractedUser?.userId) {
        user = { id: extractedUser.userId };
      } else {
        throw new BadRequestException('Invalid or expired token');
      }
    }

    if (!user) {
      throw new BadRequestException('User not authenticated or missing token');
    }

    const institution = await this.institutionBackendService.findAll({
      pageSize: 1,
      currentPage: 1,
      sortBy: 'createdAt',
      sortByDirection: SortByDirectionEnum.ASC,
      filters: [
        {
          field: 'createdById',
          value: `${user.id}`,
          values: [],
          operator: QueryOperatorEnum.Equals,
        },
      ],
    });

    if (institution.items.length === 0) {
      throw new BadRequestException('No institution found for the user');
    }

    // Append the institution ID to the request and allow access
    req['institutionId'] = institution.items[0]?.id;
    return true;
  }

  // Helper method to extract the token safely
  private extractToken(authHeader: string): string | null {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  }
}
