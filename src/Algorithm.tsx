import lpSolver, { Model } from 'javascript-lp-solver';

const BAR_LENGTH = 160.0;
const MAX_CUTS_PER_BAR = 10;
const MAX_BARS_PER_ROUND = 6;

export type WorkOrder = {
  workOrder: string;
  job: string;
  cuts: number;
  length: number;
  material: string;
};

export type OptimizedCut = {
  round: number;
  bars: number;
  pattern: { length: number; count: number }[];
  wastePerBar: number;
  material: string;
};

export function optimizeCuts(workOrders: WorkOrder[]): OptimizedCut[] {
  const groupedByMaterial: Record<string, WorkOrder[]> = {};

  // Group orders by material to optimize each material separately
  for (const order of workOrders) {
    if (!groupedByMaterial[order.material]) {
      groupedByMaterial[order.material] = [];
    }
    groupedByMaterial[order.material].push(order);
  }

  const allRounds: OptimizedCut[] = [];
  let roundCounter = 1;

  // Process each material group
  for (const material in groupedByMaterial) {
    // Sort orders so that those with job 'Job' come first for prioritization
    const orders = groupedByMaterial[material].sort((a, b) => a.job === 'Job' && b.job !== 'Job' ? -1 : 1);

    // Aggregate total demand for each cut length (keyed by fixed decimal string)
    const demand: Record<string, number> = {};
    for (const order of orders) {
      const key = parseFloat(order.length.toString()).toFixed(3);
      demand[key] = (demand[key] || 0) + parseInt(order.cuts.toString());
    }

    // Extract unique cut lengths as numbers for pattern generation
    const cutTypes = Object.keys(demand).map(Number);
    const patterns: number[][] = [];

    // Recursively generate all possible cutting patterns within bar length and max cuts constraints
    function generatePatterns(depth = 0, pattern: number[] = [], total = 0) {
      if (depth === cutTypes.length) {
        // Only add patterns that fit within the bar length and have at least one cut
        if (total <= BAR_LENGTH && pattern.reduce((a, b) => a + b, 0) > 0) {
          patterns.push([...pattern]);
        }
        return;
      }

      for (let i = 0; i <= MAX_CUTS_PER_BAR; i++) {
        const nextTotal = total + i * cutTypes[depth];
        if (nextTotal > BAR_LENGTH) break; // Prune patterns exceeding bar length
        pattern.push(i);
        generatePatterns(depth + 1, pattern, nextTotal);
        pattern.pop();
      }
    }

    generatePatterns();

    // Construct the linear programming model to minimize the number of bars used
    const model: Model & { ints: Record<string, number> } = {
      optimize: 'bars',
      opType: 'min',
      constraints: {},
      variables: {},
      ints: {}
    };

    // Add constraints for each cut type to ensure demand is met or exceeded
    cutTypes.forEach((cut) => {
      model.constraints[cut] = { min: demand[cut.toFixed(3)] };
    });

    // Add variables representing each cutting pattern with integer constraints
    patterns.forEach((pattern, idx) => {
      const variable: Record<string, number> = { bars: 1 }; // Each pattern uses one bar per unit
      cutTypes.forEach((cut, j) => {
        if (pattern[j] > 0) {
          variable[cut] = pattern[j]; // Number of cuts of this length in the pattern
        }
      });
      const key = `pattern_${idx}`;
      model.variables[key] = variable;
      model.ints[key] = 1; // Enforce integer solutions for pattern counts
    });

    // Solve the LP model to find optimal cutting patterns and bar counts
    const result: Record<string, number> = lpSolver.Solve(model) as Record<string, number>;

    // Process the solution: for each pattern used, calculate waste and split bars into rounds
    Object.entries(result)
      .filter(([key]) => key.startsWith('pattern_') && result[key] > 0)
      .forEach(([key]) => {
        const pattern = patterns[parseInt(key.split('_')[1])];
        const cuts = pattern
          .map((count, j) => ({ length: cutTypes[j], count }))
          .filter(c => c.count > 0);

        // Calculate waste per bar as leftover length after cuts
        const usedLength = cuts.reduce((sum, c) => sum + c.length * c.count, 0);
        const waste = +(BAR_LENGTH - usedLength).toFixed(3);
        const totalBars = Math.ceil(result[key]); // Round up to whole bars

        // Split the total bars into rounds with a maximum number of bars per round
        let remaining = totalBars;
        while (remaining > 0) {
          const barsThisRound = Math.min(remaining, MAX_BARS_PER_ROUND);
          allRounds.push({
            round: roundCounter++,
            bars: barsThisRound,
            pattern: cuts,
            wastePerBar: waste,
            material,
          });
          remaining -= barsThisRound;
        }
      });
  }

  // Return all cutting rounds with optimized patterns and bar counts
  return allRounds;
}
