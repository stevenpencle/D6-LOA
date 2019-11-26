import { Component, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/services/environment/toast.service';

@Component({
  selector: 'app-toasts-container',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hide)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTemplate"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTemplate }}</ng-template>
    </ngb-toast>
  `,
  host: { '[class.ngb-toasts]': 'true' }
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) {
    return toast.textOrTemplate instanceof TemplateRef;
  }
}
