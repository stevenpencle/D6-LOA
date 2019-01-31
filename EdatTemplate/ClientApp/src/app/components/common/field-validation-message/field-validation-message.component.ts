import { Component, Input } from '@angular/core';
import { ModelStateValidations } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-field-validation-message',
  templateUrl: './field-validation-message.component.html'
})
export class FieldValidationMessageComponent {
  errors: string[];

  @Input()
  property: string;

  private _validations: ModelStateValidations;

  @Input()
  set validations(validations: ModelStateValidations) {
    this._validations = validations;
    this.errors = [];
    if (this.property == null) {
      return;
    }
    this._validations.validations.forEach(validation => {
      if (
        validation.property.trim().toLowerCase() ===
        this.property.trim().toLowerCase()
      ) {
        validation.validations.forEach((error: string) => {
          this.errors.push(error);
        });
      }
    });
  }

  get validations(): ModelStateValidations {
    return this._validations;
  }

  constructor() {}
}
