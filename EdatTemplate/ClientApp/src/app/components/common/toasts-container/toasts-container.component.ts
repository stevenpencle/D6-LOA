import { Component, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/services/environment/toast.service';

@Component({
  selector: 'app-toasts-container',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.scss']
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) {
    return toast.textOrTemplate instanceof TemplateRef;
  }
}
