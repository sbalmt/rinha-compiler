export const parseString = (string: string): string => {
  return string.substring(1, string.length - 1).replace(/(\\[\w\\])/g, (match) => {
    switch (match) {
      case '\\r':
        return '\r';
      case '\\n':
        return '\n';
      case '\\t':
        return '\t';
      default:
        return match[1];
    }
  });
};

export const serializeString = (string: string) => {
  return (
    '"' +
    string.replace(/(\n\r\t)/g, (match) => {
      switch (match) {
        case '\r':
          return '\\r';
        case '\n':
          return '\\n';
        case '\t':
          return '\\t';
        default:
          return match[1];
      }
    }) +
    '"'
  );
};
