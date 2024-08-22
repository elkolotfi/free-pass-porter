import { AccessTypeService } from "@/services/access-type.service";

describe('AccessTypeService', () => {
  const service: AccessTypeService = AccessTypeService.getInstance();


  it('should return the same instance', () => {
    const instance1 = AccessTypeService.getInstance();
    const instance2 = AccessTypeService.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('parseAccess', () => {
    it('should return "citizen" for access "-1"', () => {
      expect(service.parseAccess('-1')).toBe('citizen');
    });

    it('should return a number for numeric access', () => {
      expect(service.parseAccess('30')).toBe(30);
    });

    it('should return the original string for non-numeric access', () => {
      expect(service.parseAccess('visa required')).toBe('visa required');
    });
  });

  describe('getBestAccess', () => {
    it('should return the highest number for numeric accesses', () => {
      expect(service.getBestAccess([10, 20, 30])).toBe(30);
    });

    it('should return the best access type based on ORDERED_ACCESS_TYPES', () => {
      expect(service.getBestAccess(['visa on arrival', 'e-visa', 'citizen'])).toBe('citizen');
      expect(service.getBestAccess(['visa on arrival', 'e-visa'])).toBe('visa on arrival');
      expect(service.getBestAccess(['visa on arrival', 'e-visa', 'visa free'])).toBe('visa free');
    });

    it('should handle mixed access types', () => {
      expect(service.getBestAccess([10, 'visa on arrival', 20])).toBe(20);
      expect(service.getBestAccess([10, 'visa free', 20])).toBe(20);
    });
  });

  describe('formatAccess', () => {
    it('should format numeric access correctly', () => {
      expect(service.formatAccess(30)).toBe('visa free (30 days)');
    });

    it('should return the original string for non-numeric access', () => {
      expect(service.formatAccess('visa required')).toBe('visa required');
    });
  });
});
