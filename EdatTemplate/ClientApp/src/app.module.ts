import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

// routing
import { AppRoutingModule } from './app-routing.module';

// components
import { AppComponent } from './app/components/app/app.component';
import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { NavMenuComponent } from './app/components/nav-menu/nav-menu.component';
import { HomeComponent } from './app/components/home/home.component';
import { FilterFieldComponent } from './app/components/common/filter-field/filter-field.component';
import { SortButtonComponent } from './app/components/common/sort-button/sort-button.component';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';
import { StaffPickerComponent } from './app/components/common/staff-picker/staff-picker.component';
import { FileUploadComponent } from './app/components/common/file-upload/file-upload.component';

// services
import { EnvironmentService } from './app/services/environment/environment.service';
import { HttpService } from './app/services/http/http.service';
import { SecurityService } from './app/services/security/security.service';
import { RouteGuard } from './app/services/security/route-guard';
import { DataNavigationService } from './app/services/data/data-navigation.service';
import { StaffService } from './app/services/data/staff.service';
import { NgbMomentDatePickerAdapter } from './app/services/data/ngbMomentDatePickerAdapter';
import { ExcelExportService } from './app/services/data/excel-export.service';
import { BlobService } from './app/services/data/blob.service';

// features
// ** administration
import { SampleComponent } from './app/features/administration/sample/sample.component';
import { SampleModalComponent } from './app/features/administration/sample/sample-modal.component';
import { SampleStoreService } from './app/features/administration/sample/sample-store.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavMenuComponent,
    FilterFieldComponent,
    SortButtonComponent,
    StaffPickerComponent,
    FileUploadComponent,
    HomeComponent,
    NotAuthorizedComponent,
    // features
    // ** administration
    SampleComponent,
    SampleModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [
    EnvironmentService,
    DataNavigationService,
    ExcelExportService,
    StaffService,
    BlobService,
    HttpService,
    SecurityService,
    RouteGuard,
    // stores
    // ** administration
    SampleStoreService,
    { provide: NgbDateAdapter, useClass: NgbMomentDatePickerAdapter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
