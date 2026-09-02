import { ApiProperty } from '@nestjs/swagger';

class Metadata {
  @ApiProperty()
  readonly itemCount!: number;

  @ApiProperty()
  readonly totalItems!: number;

  @ApiProperty()
  readonly itemsPerPage!: number;

  @ApiProperty()
  readonly totalPages!: number;

  @ApiProperty()
  readonly currentPage!: number;

  @ApiProperty()
  readonly hasNextPage!: boolean;

  @ApiProperty()
  readonly hasPreviousPage!: boolean;
}

export const PaginateType = <T>(Item: { new (): T }) => {
  class Paginated {
    @ApiProperty({ type: [Item] })
    readonly items!: T[];

    @ApiProperty({ type: Metadata })
    readonly meta!: Metadata;
  }
  
  return Paginated;
};
