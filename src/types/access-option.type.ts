export type AccessType = 'citizen' |'visa free' |'visa on arrival' | 'e-visa' | 'visa required';

export interface AccessOption {
  value: AccessType;
}

export const accessTypes: { [key: string]: string } = {
  'citizen': '#4CAF50',
  'visa free': '#8BC34A',
  'visa on arrival': '#6bd38c',
  'e-visa': '#FFC107',
  'visa required': '#FF5722',
};