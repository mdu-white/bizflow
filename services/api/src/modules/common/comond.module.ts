import { Global, Module } from "@nestjs/common";

import { OrganizationContextService } from "./services/organization-context.service";

@Global()
@Module({
  providers: [OrganizationContextService],
  exports: [OrganizationContextService]
})
export class CommonModule {}