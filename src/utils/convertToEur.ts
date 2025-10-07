const RATES_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json';

async function convertToEur(price: number, currency: string) {
  const res = await fetch(RATES_URL, { next: { revalidate: 3600 } }); // cache ~1h
  if (!res.ok) throw new Error('Failed to fetch rates');
  const { eur } = (await res.json()) as { eur: Record<string, number> };

  const rate = eur[currency.toLowerCase()];
  if (rate == null) throw new Error(`Unsupported currency: ${currency}`);
  return price / rate;
}

export default convertToEur;
