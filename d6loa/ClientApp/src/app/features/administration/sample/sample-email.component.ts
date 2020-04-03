import { Component } from '@angular/core';
import { IStaff, IEmailMessage } from '../../../model/model';
import { EmailService } from 'src/app/services/data/email.service';
import { ToastService } from 'src/app/services/environment/toast.service';

@Component({
  selector: 'app-sample-email',
  templateUrl: './sample-email.component.html'
})
export class SampleEmailComponent {
  emailStaff: IStaff = null;

  constructor(
    private emailService: EmailService,
    private toastService: ToastService
  ) {}

  changeEmailStaff(staff: IStaff): void {
    if (staff == null) {
      this.emailStaff = null;
    } else {
      this.emailStaff = staff;
    }
  }

  emailSelectedStaff(): void {
    const emailMessage: IEmailMessage = {
      tos: [this.emailStaff.emailAddress],
      body: 'Testing',
      subject: 'Testing EDAT Template Email Service'
    };
    this.emailService.send(emailMessage, result => {
      if (result) {
        this.toastService.show('Email successfully sent', {
          classname: 'bg-success text-light',
          delay: 5000
        });
      } else {
        this.toastService.show('Email send error', {
          classname: 'bg-danger text-light',
          delay: 5000
        });
      }
    });
  }
}
