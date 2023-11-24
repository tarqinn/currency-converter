import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  mobile: boolean = false;
  constructor(public currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getExchangeRates().subscribe(data => {
      this.currencyService.exchangeRates = data.rates;
    });
    if (window.innerWidth < 768) { // 768px portrait
      this.mobile = true;
    }
  }
}
