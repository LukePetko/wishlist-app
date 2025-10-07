const convertToEur = async (price: number, currency: string) => {
  const data = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
  );
  const json = await data.json();
  const eur = json.eur;

  return price / eur[currency.toLowerCase()];
};

export default convertToEur;
