import * as Core from '@xcheme/core';

export const enum Types {
  DUPLICATE_IDENTIFIER = 0x100,
  UNEXPECTED_TOKEN,
  UNEXPECTED_SYNTAX,
  UNDEFINED_IDENTIFIER,
  NOT_A_NUMBER,
  INVALID_CALL,
  MISSING_PARAMETER,
  EXTRA_PARAMETER,
  INVALID_TUPLE
}

const errorMessages = {
  [Types.DUPLICATE_IDENTIFIER]: 'Duplicate identifier "{0}" at line {1}, column {2}.',
  [Types.UNEXPECTED_TOKEN]: 'Unexpected token "{0}" at line {1}, column {2}.',
  [Types.UNEXPECTED_SYNTAX]: 'Unexpected syntax "{0}" at line {1}, column {2}.',
  [Types.UNDEFINED_IDENTIFIER]: 'Identifier "{0}" at line {1}, column {2} was not defined.',
  [Types.NOT_A_NUMBER]: 'Operand "{0}" is not number at line {1}, column {2}.',
  [Types.INVALID_CALL]: 'Operand "{0}" at line {1}, column {2} is not a function.',
  [Types.MISSING_PARAMETER]: 'Parameter for argument "{0}" at line {1}, column {2} is missing.',
  [Types.EXTRA_PARAMETER]: 'Extra parameter "{0}" is not necessary at line {1}, column {2}.',
  [Types.INVALID_TUPLE]: 'Argument "{0}" is not a tuple at line {1}, column {2}.'
};

const fillMessage = (message: string, fragment: Core.Fragment) => {
  const location = fragment.location;

  return message.replace(/(\{[0-2]\})/g, (match: string): string => {
    switch (match) {
      case '{0}':
        return fragment.data.replace(/\n/g, '\\n');

      case '{1}':
        return (location.line.begin + 1).toString();

      case '{2}':
        return (location.column.begin + 1).toString();
    }

    return match;
  });
};

export const getMessage = (value: number, fragment: Core.Fragment) => {
  const message = errorMessages[value as Types];

  if (!message) {
    throw `Error message (code: ${value}) doesn't found.`;
  }

  return fillMessage(message, fragment);
};

export const getLogMessage = (error: Core.LogRecord) => {
  return getMessage(error.value, error.fragment);
};
