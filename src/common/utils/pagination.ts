import { BadRequestException } from '@nestjs/common';
import { isNaN, isNil } from 'lodash';

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_RECORD_PER_PAGE,
} from '../constants/pagination.constant';
import { TPagination } from '../types/pagination.type';

export function getPaginationValue({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  page?: number;
  pageSize?: number;
}) {
  if (page < 0 || pageSize < 0) {
    throw new BadRequestException('invalid page and pageSize query');
  }

  const preTake = isNaN(pageSize) || isNil(pageSize) ? DEFAULT_PAGE_SIZE : pageSize;

  const prePage = isNaN(page) || isNil(page) ? DEFAULT_PAGE : page;

  const take = preTake > MAX_RECORD_PER_PAGE ? MAX_RECORD_PER_PAGE : preTake;

  return {
    skip: (prePage - 1) * take,
    take,
  };
}

export function generatePagination({
  totalCounts,
  take = DEFAULT_PAGE_SIZE,
  skip = 0,
}): TPagination {
  return {
    totalCounts,
    page: skip / take + 1,
    pageSize: take,
    totalPages: Math.ceil(totalCounts / take),
  };
}
