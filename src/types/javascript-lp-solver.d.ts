// src/types/javascript-lp-solver.d.ts
declare module 'javascript-lp-solver' {
    interface Constraint {
        [key: string]: number;
    }

    interface Variable {
        [key: string]: number;
    }

    export interface Model {
        optimize: string;
        opType: 'min' | 'max';
        constraints: Record<string, { min?: number; max?: number }>;
        variables: Record<string, Record<string, number>>;
    }

    interface Solution {
        feasible: boolean;
        result: number;
        [key: string]: number | boolean;
    }

    const lpSolver: {
        Solve(model: Model): Record<string, number>;
    };

    export default lpSolver;
}