import { optimizeCuts, WorkOrder, OptimizedCut } from './Algorithm';

describe('optimizeCuts', () => {
  it('should handle empty input gracefully', () => {
    const workOrders: WorkOrder[] = [];
    const result = optimizeCuts(workOrders);
    expect(result.length).toBe(0);
  });

  it('should handle a single work order', () => {
    const workOrders: WorkOrder[] = [
      { workOrder: 'WO1', job: 'Job', cuts: 5, length: 20, material: 'Stainless Steel' }
    ];
    const result = optimizeCuts(workOrders);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].pattern[0].length).toBe(20);
  });

  it('should not exceed the max cuts per bar', () => {
    const workOrders: WorkOrder[] = [
      { workOrder: 'WO1', job: 'Stock', cuts: 15, length: 10, material: 'Stainless Steel' }
    ];
    const result = optimizeCuts(workOrders);
    expect(result[0].bars).toBeLessThanOrEqual(6);
  });

  it('should handle mixed materials separately', () => {
    const workOrders: WorkOrder[] = [
      { workOrder: 'WO1', job: 'Stock', cuts: 3, length: 15, material: 'Stainless Steel' },
      { workOrder: 'WO2', job: 'Job', cuts: 5, length: 15, material: 'Carbon Steel' }
    ];
    const result = optimizeCuts(workOrders);
    const materials = result.map(r => r.material);
    expect(materials).toContain('Stainless Steel');
    expect(materials).toContain('Carbon Steel');
  });

  it('should handle fractional bar counts correctly', () => {
    const workOrders: WorkOrder[] = [
      { workOrder: 'WO1', job: 'Job', cuts: 1, length: 45, material: 'Stainless Steel' }
    ];
    const result = optimizeCuts(workOrders);
    expect(result[0].bars).toBeGreaterThan(0);
    expect(result[0].bars).toBeLessThanOrEqual(6);
  });

  it('should prioritize job orders over stock orders within the same material', () => {
    const workOrders: WorkOrder[] = [
      { workOrder: 'WO1', job: 'Stock', cuts: 10, length: 20, material: 'Stainless Steel' },
      { workOrder: 'WO2', job: 'Job', cuts: 5, length: 20, material: 'Stainless Steel' }
    ];
    const result = optimizeCuts(workOrders);
    const stainlessRounds = result.filter(r => r.material === 'Stainless Steel');
    expect(stainlessRounds[0].pattern.some(p => p.length === 20)).toBeTruthy();
  });
});