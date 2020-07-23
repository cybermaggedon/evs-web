import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule }    from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SliderComponent } from './slider/slider.component';
import { DeviceRiskComponent } from './device-risk/device-risk.component';
import { ResourceRiskComponent } from './resource-risk/resource-risk.component';
import { ThreatDetailComponent } from './threat-detail/threat-detail.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { EventTableComponent } from './event-table/event-table.component';
import { RiskDashboardComponent } from './risk-dashboard/risk-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SliderComponent,
    DeviceRiskComponent,
    ResourceRiskComponent,
    ThreatDetailComponent,
    CategoryDetailComponent,
    EventTableComponent,
    RiskDashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    MatExpansionModule,
    NgxDatatableModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
