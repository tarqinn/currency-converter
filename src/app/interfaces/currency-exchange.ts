export interface CurrencyExchange {
  base: string;
  rates: {
    [key: string]: number;
  }
}
