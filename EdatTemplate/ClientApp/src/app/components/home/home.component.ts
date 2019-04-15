import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { detect } from 'detect-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  queryParamsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      let reload = params['reload'];
      if (reload === 'true') {
        this.router.navigateByUrl('/home').then(() => {
          const browser = detect();
          if (browser) {
            switch (browser.name) {
              case 'chrome':
              case 'firefox':
              case 'edge':
                break;
              default:
                location.reload(true);
            }
          } else {
            location.reload(true);
          }
        });
      }
    });
  }
}
