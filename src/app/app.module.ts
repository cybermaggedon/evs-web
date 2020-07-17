import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule }    from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RiskSliderComponent } from './risk-slider/risk-slider.component';
import { DeviceRiskComponent } from './device-risk/device-risk.component';
import { ResourceRiskComponent } from './resource-risk/resource-risk.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { ResourceDetailComponent } from './resource-detail/resource-detail.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RiskSliderComponent,
    DeviceRiskComponent,
    ResourceRiskComponent,
    DeviceDetailComponent,
    ResourceDetailComponent,
    CategoryDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
