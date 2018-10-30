import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import * as jQuery from 'jquery';
import { HttpService } from '../../services/http/http.service';
import { IEdatHeader } from '../../model/model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  header: IEdatHeader = {};

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get<IEdatHeader>('api/site/GetHeader', result => {
      this.header = result;
    });
    // stick nav on scroll
    jQuery(window).scroll(() => {
      // console.log(jQuery(window).scrollTop());
      if (jQuery(window).scrollTop() > 153) {
        jQuery('#navigationMenu').addClass('fixed-top');
        jQuery('#contentBuffer').addClass('content-fixed-top-buffer');
        jQuery('#contentBuffer').removeClass('content-buffer');
      }
      if (jQuery(window).scrollTop() < 153) {
        jQuery('#navigationMenu').removeClass('fixed-top');
        jQuery('#contentBuffer').addClass('content-buffer');
        jQuery('#contentBuffer').removeClass('content-fixed-top-buffer');
      }
    });
  }
}
