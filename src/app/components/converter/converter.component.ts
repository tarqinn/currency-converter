import {Component, OnInit} from '@angular/core';
import {CurrencyService} from '../../services/currency.service';
import {map, Observable, startWith} from 'rxjs';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {CurrencyGroup} from '../../interfaces/currency-group';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  constructor(
    public currencyService: CurrencyService
  ) {}

  filteredCurrencies1!: Observable<CurrencyGroup[]>;
  filteredCurrencies2!: Observable<CurrencyGroup[]>;

  amountInputControl1: FormControl = new FormControl(null, [
    Validators.maxLength(20),
    Validators.pattern('\\d{0,}(\\.\\d{0,})?')
  ]);
  amountInputControl2: FormControl = new FormControl(null, [
    Validators.maxLength(20),
    Validators.pattern('\\d{0,}(\\.\\d{0,})?')
  ]);
  currencyInputControl1: FormControl = new FormControl(
    '', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
      this.currencyInputValidator()]
  );
  currencyInputControl2: FormControl = new FormControl(
    '', [
      Validators.required,
      Validators.minLength(2),
      this.currencyInputValidator()
    ]
  );

  ngOnInit() {
    this.filteredCurrencies1 = this.currencyInputControl1.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value))
    );

    this.filteredCurrencies2 = this.currencyInputControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value))
    );
  }

  private _filter(options: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(currency => currency.toLowerCase().includes(filterValue));
  }

  private _filterGroup(value: string): CurrencyGroup[] {
    if (value) {
      return this.currencyService.listOfCurrencyCodes
        .map((group: CurrencyGroup) => ({name: group.name, values: this._filter(group.values, value)}))
        .filter((group: CurrencyGroup) => group.values.length > 0) as CurrencyGroup[];
    }
    return this.currencyService.listOfCurrencyCodes;
  }

  displayFn(value: string): string {
    return value;
  }
  convertCurrency1(): void {
    if (this.amountInputControl1.value
      && this.currencyInputControl1.valid
      && this.currencyInputControl2.valid
    ) {
      this.amountInputControl2.setValue(
        (
          this.amountInputControl1.value * this.currencyService.calculateExchangeRate(
            this.currencyInputControl2.value,
            this.currencyInputControl1.value
          )
        ).toFixed(2) || 0
      );
    }
  }

  convertCurrency2(): void {
    if (this.amountInputControl2.value
      && this.currencyInputControl2.valid
      && this.currencyInputControl1.valid
    ) {
      this.amountInputControl1.setValue(
        (
          this.amountInputControl2.value * this.currencyService.calculateExchangeRate(
            this.currencyInputControl1.value,
            this.currencyInputControl2.value
          )
        ).toFixed(2) || 0
      );
    }
  }

  currencyInputValidator(): ValidatorFn {
    return (control:AbstractControl) : { [key: string]: boolean } | null => {

      const value = control.value;

      if (!value) {
        return null;
      }


      const currencyInputValid = Object.keys(this.currencyService.exchangeRates).indexOf(value);

      return currencyInputValid === -1 ? {currencyInputFromList:true} : null;
    };
  }
}

