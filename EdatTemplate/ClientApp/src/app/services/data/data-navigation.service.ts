import { Injectable } from '@angular/core';
import * as linq from 'linq';

@Injectable()
export class DataNavigationService {
  constructor() {}

  init<T>(
    data: Array<T>,
    initialSortField: string,
    pageSize: number,
    initialSortDirection: 'ascending' | 'descending' = 'ascending'
  ): DataNavigation<T> {
    const dn: DataNavigation<T> = {
      sourceData: data,
      sortedFilteredData: data,
      pageData: [],
      currentSortField: initialSortField,
      currentSortDirection: initialSortDirection,
      pageSize: pageSize,
      currentPage: 0,
      totalPages: 0
    };
    this.doSort(dn, initialSortField);
    this.resetPaging(dn, pageSize, true);
    return dn;
  }

  clear<T>(data: DataNavigation<T>): void {
    data.sortedFilteredData = [];
    data.sourceData = [];
  }

  sort<T>(data: DataNavigation<T>, newField: string): void {
    if (newField === data.currentSortField) {
      if (data.currentSortDirection === 'ascending') {
        data.currentSortDirection = 'descending';
      } else {
        data.currentSortDirection = 'ascending';
      }
    } else {
      data.currentSortField = newField;
      data.currentSortDirection = 'ascending';
    }
    this.doSort(data, newField);
  }

  filter<T>(
    data: DataNavigation<T>,
    filters: Array<FilterEvent>,
    resetPaging: boolean
  ): void {
    data.sortedFilteredData = [...data.sourceData];
    for (let i = 0; i < filters.length; i++) {
      const fieldGraph = filters[i].field.split('.');
      if (fieldGraph.length === 1) {
        data.sortedFilteredData = linq
        .from(data.sortedFilteredData)
        .where(x => {
          if (
            x[filters[i].field] == null &&
            (filters[i].value == null || filters[i].value.trim() === '')
          ) {
            return true;
          }
          if (x[filters[i].field] == null) {
            return false;
          }
          return (x[filters[i].field] as string)
            .toString()
            .toUpperCase()
            .includes(filters[i].value.toUpperCase());
        })
        .toArray();
      }
      if (fieldGraph.length === 2) {
        data.sortedFilteredData = linq
        .from(data.sortedFilteredData)
        .where(x => {
          if (
            x[fieldGraph[0]][fieldGraph[1]] == null &&
            (filters[i].value == null || filters[i].value.trim() === '')
          ) {
            return true;
          }
          if (x[fieldGraph[0]][fieldGraph[1]] == null) {
            return false;
          }
          return (x[fieldGraph[0]][fieldGraph[1]] as string)
            .toString()
            .toUpperCase()
            .includes(filters[i].value.toUpperCase());
        })
        .toArray();
      }
    }
    this.doSort(data, data.currentSortField);
    this.resetPaging(data, data.pageSize, resetPaging);
  }

  page<T>(data: DataNavigation<T>, direction: 'previous' | 'next'): void {
    data.currentPage += direction === 'next' ? 1 : -1;
    data.pageData = linq
      .from(data.sortedFilteredData)
      .skip((data.currentPage - 1) * data.pageSize)
      .take(data.pageSize)
      .toArray();
  }

  private doSort<T>(data: DataNavigation<T>, field: string): void {
    const fieldGraph = field.split('.');
    if (data.currentSortDirection === 'ascending') {
      data.sortedFilteredData = linq
        .from(data.sortedFilteredData)
        .orderBy(x => (
          fieldGraph.length === 1 
          ? x[fieldGraph[0]] == null 
            ? ''
            : x[fieldGraph[0]] 
          : fieldGraph.length === 2 
            ? x[fieldGraph[0]][fieldGraph[1]] == null 
              ? ''
              : x[fieldGraph[0]][fieldGraph[1]]
            : null))
        .toArray();
    } else {
      data.sortedFilteredData = linq
        .from(data.sortedFilteredData)
        .orderByDescending(x => (
        fieldGraph.length === 1
          ? x[fieldGraph[0]] == null
            ? ''
            : x[fieldGraph[0]]
          : fieldGraph.length === 2
            ? x[fieldGraph[0]][fieldGraph[1]] == null
              ? ''
              : x[fieldGraph[0]][fieldGraph[1]]
            : null))
        .toArray();
    }
    if (data.pageSize > 0) {
      data.pageData = linq
        .from(data.sortedFilteredData)
        .skip((data.currentPage - 1) * data.pageSize)
        .take(data.pageSize)
        .toArray();
    }
  }

  private resetPaging<T>(
    dataNavigation: DataNavigation<T>,
    pageSize: number,
    startAt0: boolean
  ): void {
    if (pageSize > 0) {
      if (startAt0) {
        dataNavigation.currentPage = 0;
        dataNavigation.pageSize = pageSize;
      }
      dataNavigation.totalPages = Math.floor(
        dataNavigation.sortedFilteredData.length / dataNavigation.pageSize
      );
      if (
        dataNavigation.sortedFilteredData.length %
        dataNavigation.pageSize >
        0
      ) {
        dataNavigation.totalPages += 1;
      }
      if (startAt0) {
        this.page(dataNavigation, 'next');
      }
    }
  }
}

export interface DataNavigation<T> {
  sourceData: Array<T>;
  sortedFilteredData: Array<T>;
  pageData: Array<T>;
  currentSortField: string;
  currentSortDirection: 'ascending' | 'descending';
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterEvent {
  field: string;
  value: any;
}
