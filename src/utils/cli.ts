export type InputArguments = {
  debug: boolean;
  enableHoisting: boolean;
  constantFolding: boolean;
  constantPropagation: boolean;
  enableMemoization: boolean;
  inputFile: string | number;
};

const defaultInputArguments: InputArguments = {
  debug: false,
  enableHoisting: true,
  enableMemoization: true,
  constantPropagation: true,
  constantFolding: true,
  inputFile: 0
};

export const getInputArguments = () => {
  const inputArguments = { ...defaultInputArguments };
  const allArguments = process.argv.slice(2);

  for (let index = 0; index < allArguments.length; ++index) {
    const currentArgument = allArguments[index];

    switch (currentArgument) {
      case '--debug':
        inputArguments.debug = true;
        break;

      case '--no-hoisting':
        inputArguments.enableHoisting = false;
        break;

      case '--no-constant-folding':
        inputArguments.constantFolding = false;
        break;

      case '--no-constant-propagation':
        inputArguments.constantPropagation = false;
        break;

      case '--no-memoization':
        inputArguments.enableMemoization = false;
        break;

      case '--':
        inputArguments.inputFile = allArguments[++index];
        break;

      default:
        throw `CLI option '${currentArgument}' is not valid.`;
    }
  }

  return inputArguments;
};
