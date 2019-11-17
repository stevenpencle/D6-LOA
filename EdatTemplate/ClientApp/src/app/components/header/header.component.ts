import { Component, OnInit, OnDestroy } from '@angular/core';
import { IEdatHeader } from '../../model/model';
import { EnvironmentService } from 'src/app/services/environment/environment.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  header: IEdatHeader = {};

  constructor(private environmentService: EnvironmentService) {}

  ngOnInit(): void {
    this.environmentService.safeSubscribe(this, state => {
      this.header = state.header;
      this.stickNav();
    });
  }

  ngOnDestroy(): void {}

  stickNav(): void {
    let fixedTop = false;
    const w = window;
    const d = document;
    const navigationMenu = d.getElementById('navigationMenu');
    const contentBuffer = d.getElementById('contentBuffer');
    const onScrollEventHandler = () => {
      const topPosition = w.scrollY;
      const environmentWarningLarge = this.header.showEnvironmentWarning
        ? d.getElementById('environmentWarningLarge')
        : null;
      const environmentWarningSmall = this.header.showEnvironmentWarning
        ? d.getElementById('environmentWarningSmall')
        : null;
      if (topPosition > 153 && !fixedTop) {
        fixedTop = true;
        navigationMenu.classList.add('fixed-top');
        contentBuffer.classList.remove('content-buffer');
        if (this.header.showEnvironmentWarning) {
          environmentWarningLarge.classList.add('environment-warning');
          environmentWarningSmall.classList.add('environment-warning');
          contentBuffer.classList.add(
            'environment-warning-content-fixed-top-buffer'
          );
        } else {
          contentBuffer.classList.add('content-fixed-top-buffer');
        }
      } else if (topPosition < 153 && fixedTop) {
        fixedTop = false;
        navigationMenu.classList.remove('fixed-top');
        contentBuffer.classList.add('content-buffer');
        if (this.header.showEnvironmentWarning) {
          environmentWarningLarge.classList.remove('environment-warning');
          environmentWarningSmall.classList.remove('environment-warning');
          contentBuffer.classList.remove(
            'environment-warning-content-fixed-top-buffer'
          );
        } else {
          contentBuffer.classList.remove('content-fixed-top-buffer');
        }
      }
    };
    if (w.addEventListener) {
      w.addEventListener('scroll', onScrollEventHandler, false);
    }
  }
}
