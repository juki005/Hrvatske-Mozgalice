/**
 * Safe mathematical string evaluator for Igra Brojeva.
 */

export function evaluateExpression(expression: (number | string)[]): number | null {
  if (expression.length === 0) return null;

  try {
    const exprString = expression.join(' ');
    
    // Basic validation: only numbers, operators, and parentheses
    if (!/^[0-9+\-*/() ]+$/.test(exprString)) {
      return null;
    }

    // Check for balanced parentheses
    let balance = 0;
    for (const char of exprString) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) return null;
    }
    if (balance !== 0) return null;

    // Check for invalid operator sequences (e.g., "++", "*/")
    if (/[\+\-\*\/]{2,}/.test(exprString.replace(/\s/g, ''))) {
      return null;
    }

    // Evaluate using Function constructor (safer than eval, but still needs caution)
    // We've already sanitized the input with the regex above.
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${exprString}`)();

    if (typeof result === 'number' && Number.isFinite(result)) {
      // Return rounded to 2 decimal places if needed, but usually integers in this game
      return Math.round(result * 100) / 100;
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Finds the closest solution using a simple backtracking approach.
 * Note: This is computationally expensive for 6 numbers, so we limit the search.
 */
export function findClosestSolution(numbers: number[], target: number): { expr: string, result: number, diff: number } {
  let bestResult = -1;
  let bestExpr = "";
  let minDiff = Infinity;

  const ops = [
    { s: '+', f: (a: number, b: number) => a + b },
    { s: '-', f: (a: number, b: number) => a - b },
    { s: '*', f: (a: number, b: number) => a * b },
    { s: '/', f: (a: number, b: number) => b !== 0 && a % b === 0 ? a / b : null }
  ];

  function solve(currentNums: { val: number, expr: string }[]) {
    for (const n of currentNums) {
      const diff = Math.abs(target - n.val);
      if (diff < minDiff) {
        minDiff = diff;
        bestResult = n.val;
        bestExpr = n.expr;
      }
    }

    if (minDiff === 0 || currentNums.length === 1) return;

    for (let i = 0; i < currentNums.length; i++) {
      for (let j = 0; j < currentNums.length; j++) {
        if (i === j) continue;

        const a = currentNums[i];
        const b = currentNums[j];

        for (const op of ops) {
          const res = op.f(a.val, b.val);
          if (res !== null && res > 0) {
            const nextNums = currentNums.filter((_, idx) => idx !== i && idx !== j);
            nextNums.push({ val: res, expr: `(${a.expr}${op.s}${b.expr})` });
            solve(nextNums);
            if (minDiff === 0) return;
          }
        }
      }
    }
  }

  solve(numbers.map(n => ({ val: n, expr: n.toString() })));

  return {
    expr: bestExpr.replace(/^\((.*)\)$/, '$1'), // Remove outer parentheses
    result: bestResult,
    diff: minDiff
  };
}
