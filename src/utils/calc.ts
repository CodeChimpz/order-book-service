export class CalcService {
  // Utility function to calculate percentage difference between prices
  static calculatePercentageDifference(buy: number, sell: number): number {
    return ((sell - buy) / buy) * 100;
  }
}