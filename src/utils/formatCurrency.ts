/**
 * Formats a numeric amount into Philippine Peso (PHP) format.
 * Example: 7950 -> "₱7,950"
 */
export const formatPeso = (amount: number): string => {
  return '₱' + Math.round(amount).toLocaleString('en-PH');
};
