import { AccessType } from "@/types/types";


export const ORDERED_ACCESS_TYPES = ['citizen', 'visa free', 'visa on arrival', 'e-visa', 'visa required'];

export class AccessTypeService {
  private static INSTANCE: AccessTypeService;
  private constructor() {}

  static getInstance(): AccessTypeService {
    if (!AccessTypeService.INSTANCE) {
      AccessTypeService.INSTANCE = new AccessTypeService();
    }

    return AccessTypeService.INSTANCE;
  }

  parseAccess(access: string): AccessType {
    if (access === '-1') return 'citizen';
    const num = Number(access);
    return isNaN(num) ? access : num;
  }

  getBestAccess(accessTypes: AccessType[]): AccessType {
    const numericAccesses = accessTypes.filter((access): access is number => typeof access === 'number');
    
    if (numericAccesses.length > 0) {
      return Math.max(...numericAccesses);
    }

    return accessTypes.reduce((best, current) => {
      if (typeof best !== 'string' || typeof current !== 'string') return best;
      const bestIndex = ORDERED_ACCESS_TYPES.indexOf(best);
      const currentIndex = ORDERED_ACCESS_TYPES.indexOf(current);
      return bestIndex < currentIndex ? best : current;
    });
  }

  formatAccess(access: AccessType): string {
    if (typeof access === 'number') {
      return `visa free (${access} days)`;
    }
    return access;
  }
}