const variants = ['default', 'outline', 'secondary', 'destructive'] as const;

function pickVariantFromUuid(uuid: string) {
  const hex = uuid.replace(/-/g, '');

  const num = parseInt(hex.slice(-8), 16);

  return variants[num % variants.length];
}

export default pickVariantFromUuid;
