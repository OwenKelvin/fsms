import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActivityLogUserBackendService } from '@fsms/backend/activity-log-backend-service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@fsms/backend/auth';
import {
  ActivityLogModel,
  ActivityLogUserModel,
  IQueryParam,
  QueryOperatorEnum,
  UserModel,
} from '@fsms/backend/db';

@Resolver(() => ActivityLogUserModel)
export class ActivityLogUserResolver {
  constructor(private activityLogService: ActivityLogUserBackendService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => ActivityLogUserModel)
  async authenticatedUserActivityLogs(
    @Args('query') query: IQueryParam,
    @CurrentUser() currentUser: UserModel,
  ) {
    return await this.activityLogService.findAll(
      {
        ...query,
        filters: [
          ...(query?.filters ?? []),
          {
            operator: QueryOperatorEnum.Equals,
            field: 'userId',
            value: `${currentUser.id}`,
            values: [],
          },
        ],
      },
      [UserModel, ActivityLogModel],
    );
  }

  @ResolveField()
  id(@Parent() activityLogUserModel: ActivityLogUserModel) {
    return activityLogUserModel?.activityLog.id;
  }

  @ResolveField()
  action(@Parent() activityLogUserModel: ActivityLogUserModel) {
    return activityLogUserModel?.activityLog.action;
  }

  @ResolveField()
  description(@Parent() activityLogUserModel: ActivityLogUserModel) {
    return activityLogUserModel?.activityLog.description;
  }

  @ResolveField()
  createdAt(@Parent() activityLogUserModel: ActivityLogUserModel) {
    return activityLogUserModel?.activityLog.createdAt;
  }

  @ResolveField()
  type(@Parent() activityLogUserModel: ActivityLogUserModel) {
    return activityLogUserModel?.activityLog.type;
  }
}
