import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { discoverySearchSchema } from "@konecta/validation";
import type { DiscoverySearchResponse } from "@konecta/types";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { DiscoveryService } from "./discovery.service";
import type { DiscoverySearchDto } from "./dto/discovery-search.dto";

@Controller("discovery")
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  /**
   * Endpoint central do KONECTA Discovery. Público — descoberta local
   * não exige autenticação, assim como a maioria dos apps de busca.
   * Nunca retorna coordenadas exatas de terceiros (ver DiscoveryService).
   */
  @Get("search")
  @UsePipes(new ZodValidationPipe(discoverySearchSchema))
  async search(
    @Query() query: DiscoverySearchDto,
  ): Promise<DiscoverySearchResponse> {
    return this.discoveryService.search(query);
  }
}
