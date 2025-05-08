export function formatCurrency(value: number | string | null | undefined): string {
  const numericValue = Number(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericValue ?? 0);
}