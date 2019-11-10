import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import fontawesome from '@fortawesome/fontawesome';
import * as fas from '@fortawesome/fontawesome-free-solid';
import { EnvironmentService } from 'src/app/services/environment/environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showWarning = false;

  constructor(
    private environmentService: EnvironmentService,
    private router: Router
  ) {
    fontawesome.library.add(fas.default);
  }

  ngOnInit(): void {
    const fastRoute = localStorage.getItem('fast-route');
    this.environmentService.safeSubscribe(this, state => {
      this.showWarning = state.header.showEnvironmentWarning;
    });
    if (
      fastRoute !== undefined &&
      fastRoute !== null &&
      fastRoute.trim() !== ''
    ) {
      localStorage.removeItem('fast-route');
      const routeData = JSON.parse(fastRoute) as LocationData;
      this.router.navigate(routeData.path, {
        queryParams: routeData.queryParams
      });
    }
  }

  ngOnDestroy(): void {}
}
