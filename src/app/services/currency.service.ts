import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CurrencyExchange} from '../interfaces/currency-exchange';
import {CurrencyGroup} from '../interfaces/currency-group';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  _listOfCurrencyCodes: CurrencyGroup[] = [];
  get listOfCurrencyCodes() {
    return this._listOfCurrencyCodes;
  }

  private _exchangeRates!: {[key: string]: number};
  get exchangeRates() {
    return this._exchangeRates;
  }
  set exchangeRates(value: {[key: string]: number}) {
    this._exchangeRates = value;
    const popularGroup: CurrencyGroup = {name: 'Popular', values: []};
    const otherGroup: CurrencyGroup = {name: 'Other', values: []};
    Object.keys(value).map((currency: string) => {
      if (currency === 'USD' || currency ===  'EUR' || currency === 'UAH') {
        popularGroup.values.push(currency);
      } else {
        otherGroup.values.push(currency);
      }
    });
    this._listOfCurrencyCodes = [popularGroup, otherGroup];
  }

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<CurrencyExchange> {
    return this.http.get('/api/latest.json') as Observable<CurrencyExchange>;
  }

  calculateExchangeRate(curr1: string, curr2: string): number {
    return this._exchangeRates[curr1] / this._exchangeRates[curr2];
  }
}
