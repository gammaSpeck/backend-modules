/**
 * AJVPropTypes Object Literal for commonly reused types
 */
export const AJVPropTypeConstants = {
  NonEmptyArray: { type: 'array', minItems: 1 },
  NonEmptyString: { type: 'string', minLength: 1 },
  Email: { type: 'string', format: 'email' },
  WholeNumber: { type: 'integer', minimum: 1 },
  NaturalNumber: { type: 'integer', minimum: 0 },
  BooleanString: { type: 'string', enum: ['0', '1'] },
  Date: { type: 'string', format: 'date' }
} as const
