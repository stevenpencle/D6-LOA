import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingService {
  showCounter = 0;

  constructor(private spinner: NgxSpinnerService) {}

  show(): () => void {
    let showSpinner = true;
    setTimeout(() => {
      this.showCounter += 1;
      if (showSpinner) {
        this.spinner.show();
      }
    }, 1500);
    const complete = () => {
      this.showCounter -= 1;
      showSpinner = false;
      if (this.showCounter === 0) {
        this.spinner.hide();
      }
    };
    return complete;
  }
}
