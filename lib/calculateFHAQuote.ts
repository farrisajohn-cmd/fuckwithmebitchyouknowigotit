export type FHAParams = { principal: number; rate?: number; termYears?: number };

export default function calculateFHAQuote({ principal, rate = 0.035, termYears = 30 }: FHAParams) {
  const monthlyRate = rate / 12;
  const n = termYears * 12;
  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  const insurance = 0.0085 * principal / 12;
  return `Monthly payment: $${payment.toFixed(2)}, PMI: $${insurance.toFixed(2)}`;
}