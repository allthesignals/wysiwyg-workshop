interface NumberObject {
  [key: string]: number;
}

interface Assert {
  /**
   * A comparison of two numbers, but rounding to 8 decimal places, to
   * ensure that floating point differences are accounted for.
   *
   * @param actual Expression being tested
   * @param expected Known comparison value
   * @param {string} [message] A short description of the assertion
   */
  numberEqual(actual: number, expected: number, message?: string): void;

  /**
   * A comparison of top level object values or properties in an array to check
   * their equality, after rounding to 8 decimal places to account for floating
   * point differentes.
   *
   * @param actual Object or Array
   * @param expected Known comparision value
   * @param {string} [message] A short description of the assertion
   */
  deepNumberEqual(
    actual: NumberObject | number[] | any,
    expected: NumberObject | number[] | any,
    message?: string
  ): void;
}
