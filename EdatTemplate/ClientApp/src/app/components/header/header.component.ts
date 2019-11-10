import { Component, OnInit, OnDestroy } from '@angular/core';
import * as jQuery from 'jquery';
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
    });
    // stick nav on scroll
    let fixedTop = false;
    const w = jQuery(window);
    const navigationMenu = jQuery('#navigationMenu');
    const contentBuffer = jQuery('#contentBuffer');
    w.on('scroll', () => {
      const topPosition = w.scrollTop();
      // console.log(w.scrollTop());
      if (topPosition > 153 && !fixedTop) {
        fixedTop = true;
        navigationMenu.addClass('fixed-top');
        contentBuffer.removeClass('content-buffer');
        if (this.header.showEnvironmentWarning) {
          jQuery('#environmentWarningLarge').addClass('environment-warning');
          jQuery('#environmentWarningSmall').addClass('environment-warning');
          contentBuffer.addClass(
            'environment-warning-content-fixed-top-buffer'
          );
        } else {
          contentBuffer.addClass('content-fixed-top-buffer');
        }
      } else if (topPosition < 153 && fixedTop) {
        fixedTop = false;
        navigationMenu.removeClass('fixed-top');
        contentBuffer.addClass('content-buffer');
        if (this.header.showEnvironmentWarning) {
          jQuery('#environmentWarningLarge').removeClass('environment-warning');
          jQuery('#environmentWarningSmall').removeClass('environment-warning');
          contentBuffer.removeClass(
            'environment-warning-content-fixed-top-buffer'
          );
        } else {
          contentBuffer.removeClass('content-fixed-top-buffer');
        }
      }
    });
  }

  ngOnDestroy(): void {}
}
