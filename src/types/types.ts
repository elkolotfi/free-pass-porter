export interface PassportData {
  [country: string]: { [country: string]: string };
}

export type AccessType = number | string;

export type FilteredResultsType = [string, { [passport: string]: AccessType; }];