//TODO: move to another file
export class BasePaginationData<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalPages: number;
    currentPosition: number;
  }