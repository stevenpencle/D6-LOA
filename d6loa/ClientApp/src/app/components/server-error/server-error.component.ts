import { Component, OnInit } from '@angular/core';
import { DataMarshalerService } from 'src/app/services/data/data-marshaler.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html'
})
export class ServerErrorComponent implements OnInit {
  errorDoc: SafeHtml;
  showDoc = false;

  constructor(
    private dataMarshalerService: DataMarshalerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.errorDoc = this.sanitizer.bypassSecurityTrustHtml(
      this.dataMarshalerService.payload
    );
    this.showDoc = true;
  }
}
