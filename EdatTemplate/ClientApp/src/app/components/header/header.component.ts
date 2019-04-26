import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
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
    let fixedTop = false;
    // stick nav on scroll
    jQuery(window).scroll(() => {
      const topPosition = jQuery(window).scrollTop();
      // console.log(jQuery(window).scrollTop());
      if (topPosition > 153 && !fixedTop) {
        fixedTop = true;
        jQuery('#navigationMenu').addClass('fixed-top');
        jQuery('#contentBuffer').removeClass('content-buffer');
        if (this.header.showEnvironmentWarning) {
          jQuery('#environmentWarningLarge').addClass('environment-warning');
          jQuery('#environmentWarningSmall').addClass('environment-warning');
          jQuery('#contentBuffer').addClass(
            'environment-warning-content-fixed-top-buffer'
          );
        } else {
          jQuery('#contentBuffer').addClass('content-fixed-top-buffer');
        }
      }
      else if (topPosition < 153 && fixedTop) {
        fixedTop = false;
        jQuery('#navigationMenu').removeClass('fixed-top');
        jQuery('#contentBuffer').addClass('content-buffer');
        if (this.header.showEnvironmentWarning) {
          jQuery('#environmentWarningLarge').removeClass('environment-warning');
          jQuery('#environmentWarningSmall').removeClass('environment-warning');
          jQuery('#contentBuffer').removeClass(
            'environment-warning-content-fixed-top-buffer'
          );
        } else {
          jQuery('#contentBuffer').removeClass('content-fixed-top-buffer');
        }
      }
    });
  }
  
  ngOnDestroy(): void {}
}
