import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceRequestService } from '../ServiceRequest/service-request.service'
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/primeng';
import { DataTableModule, DialogModule, DropdownModule, SelectItem } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AutoCompleteModule,
    DataTableModule,
    DialogModule,
    BrowserAnimationsModule,
    DropdownModule
  ],
  providers: [ServiceRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
