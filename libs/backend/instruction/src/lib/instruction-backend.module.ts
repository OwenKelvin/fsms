import { Module } from '@nestjs/common';
import { InstructionModelEventsListener } from './listeners/instruction-model-events-listener.service';
import { InstructionBackendServiceModule } from '@fsms/backend/instruction-backend-service';
import { InstructionResolver } from './resolvers/instruction.resolver';

@Module({
  imports: [InstructionBackendServiceModule],
  providers: [InstructionResolver, InstructionModelEventsListener],
  exports: [],
})
export class InstructionModule {}
