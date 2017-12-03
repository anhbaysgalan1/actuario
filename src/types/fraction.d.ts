
declare module 'fraction.js' {

  /**
   * Creates a fraction with the specified numerator and denominator values.
   * @param numerator
   * @param denominator (default: 1)
   */
  export function fraction(numerator: number, denominator?: number): Fraction;
  
  /**
   * Creates a fraction with the specified numerator and denominator values.
   * @param tupleValue a tuple representing the fraction, e.g. [3, 5] --> 3 / 5. The denominator defaults to 1.
   */
  export function fraction(tupleValue: [number, number | undefined]): Fraction;

  /**
   * Parses the given value to create a fraction.
   * 
   * @param value A string representing a rational value. This can be a double ('0.6'); a fraction ('3/5');
   *              or a double with repeating decimals encased in single quotes or parentheses
   *              (e.g. "0.'6'" --> 2/3, "0.(6)" --> 2/3, "0.0(123)" --> 41 / 3330)
   */
  export function fraction(value: string): Fraction;

  /**
   * Creates a fraction with the specified numerator, denominator, and sign.
   * @param value an object with keys 'n', 'd', and (optionally) 's'.
   */
  export function fraction(value: FractionPrototype): Fraction;


  export interface Fraction extends FractionPrototype {
    abs: () => Fraction;
    neg: () => Fraction;
  
    clone: () => Fraction;
    
    add: BinaryFractionOperator;
    sub: BinaryFractionOperator;
    mul: BinaryFractionOperator;
    div: BinaryFractionOperator;
    mod: BinaryFractionOperator;
    gcd: BinaryFractionOperator;
    lcm: BinaryFractionOperator;
    
    ceil: (places?: number) => Fraction;
    floor: (places?: number) => Fraction;
    round: (places?: number) => Fraction;
  
    inverse: () => Fraction;
  
    equals: BinaryFractionPredicate;
    compare: FractionCompare;
    divisible: BinaryFractionPredicate;
  
    /**
     * Returns the JS number value of this fraction.
     */
    valueOf: () => number;

    /**
     * Returns the mixed-number string representation of this fraction (e.g. '4 1/3')
     */
    toFraction: () => string;

    /**
     * Returns a LaTeX representation of this fraction.
     */
    toLatex: () => string;

    /**
     * Returns an array of continued fraction elements (e.g. 7/8 --> [0, 1, 7])
     */
    toContinued: () => number[];

    /**
     * Returns a string representation of this fraction, using repeated decimals if applicable (e.g. '4.(3)')
     */
    toString: () => string;
  }
  
  interface FractionPrototype {
    d: number;
    n: number;
    s?: number;
  }
  
  type FractionTuple = [number, number | undefined]
  
  type Fractionish = string | number | FractionPrototype | FractionTuple

  /**
   * Combines this fraction with the given fraction to produce a new fraction. Note that the arguments for the
   * other fraction can have any of the formats used in the fraction() constructor.
   */
  interface BinaryFractionOperator {
    (numerator: number, denominator: number): Fraction;
    (value: Fractionish): Fraction;
  }

  /**
   * Provides a boolean value using this fraction and another given fraction. Note that the arguments for the
   * other fraction can have any of the formats used in the fraction() constructor.
   */
  interface BinaryFractionPredicate {
    (numerator: number, denominator: number): boolean;
    (value: Fractionish): boolean;
  }
  

  /**
   * Compares this fraction with the given fraction. Note that the arguments for the
   * other fraction can have any of the formats used in the fraction() constructor.
   */
  interface FractionCompare {
    (numerator: number, denominator: number): number;
    (value: Fractionish): number;
  }
}