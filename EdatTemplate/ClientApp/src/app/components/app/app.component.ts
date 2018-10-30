import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import fontawesome from '@fortawesome/fontawesome';
import * as fas from '@fortawesome/fontawesome-free-solid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {
    fontawesome.library.add(fas.default);
  }

  ngOnInit(): void {
    const fastRoute = localStorage.getItem('fast-route');
    if (fastRoute != null && fastRoute.trim() !== '') {
      localStorage.removeItem('fast-route');
      const routeData = JSON.parse(fastRoute) as LocationData;
      this.router.navigate(routeData.path, {
        queryParams: routeData.queryParams
      });
    }
  }
}
