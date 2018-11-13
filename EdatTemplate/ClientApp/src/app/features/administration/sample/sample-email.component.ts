import { Component } from '@angular/core';
import { IStaff, IEmailMessage } from '../../../model/model';
import { EmailService } from 'src/app/services/data/email.service';

@Component({
  selector: 'app-sample-email',
  templateUrl: './sample-email.component.html'
})
export class SampleEmailComponent {
  emailStaff: IStaff;

  constructor(private emailService: EmailService) {}

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
    this.emailService.send(emailMessage);
  }
}
