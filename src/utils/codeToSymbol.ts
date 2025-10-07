const codeToSymbol = (code: string) => {
  let symbol = code.toUpperCase();

  switch (code) {
    case 'EUR':
      symbol = '€';
      break;
    case 'USD':
      symbol = '$';
      break;
    case 'GBP':
      symbol = '£';
      break;
    case 'CAD':
      symbol = '$';
      break;
    case 'AUD':
      symbol = '$';
      break;
    case 'NZD':
      symbol = '$';
      break;
    case 'JPY':
      symbol = '¥';
      break;
    case 'CZK':
      symbol = 'Kč';
      break;
  }

  return symbol;
};

export default codeToSymbol;
