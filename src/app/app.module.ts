
// root module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';

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
import { ChartsModule } from 'ng2-charts';
import { LossExceedenceChartComponent } from './loss-exceedence-chart/loss-exceedence-chart.component';
import { ProbabilityDistributionChartComponent } from './probability-distribution-chart/probability-distribution-chart.component';
import { RiskDistributionChartComponent } from './risk-distribution-chart/risk-distribution-chart.component';
import { RiskReportComponent } from './risk-report/risk-report.component';
import { RiskSummaryComponent } from './risk-summary/risk-summary.component';
import { AllThreatsComponent } from './all-threats/all-threats.component';
import { ModelConfigurationComponent } from './model-configuration/model-configuration.component';
import { RiskConfigurationComponent } from './risk-configuration/risk-configuration.component';
import { CustomRiskConfigurationComponent } from './custom-risk-configuration/custom-risk-configuration.component';
import { ModelSelectionComponent } from './model-selection/model-selection.component';
import { ThreatModelComponent } from './threat-model/threat-model.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { RiskSelectionComponent } from './risk-selection/risk-selection.component';
import { RiskConfigurationFilterComponent } from './risk-configuration-filter/risk-configuration-filter.component';
import { EventViewComponent } from './event-view/event-view.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

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
        LossExceedenceChartComponent,
        ProbabilityDistributionChartComponent,
        RiskDistributionChartComponent,
        RiskReportComponent,
        RiskSummaryComponent,
        AllThreatsComponent,
        ModelConfigurationComponent,
        RiskConfigurationComponent,
        CustomRiskConfigurationComponent,
        ModelSelectionComponent,
        ThreatModelComponent,
        SpinnerComponent,
        RiskSelectionComponent,
	RiskConfigurationFilterComponent,
	EventViewComponent,
	EventDetailComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
	FormsModule,
	ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
	MatInputModule,
        MatSliderModule,
        MatTabsModule,
	MatMenuModule,
	MatButtonModule,
	MatSelectModule,
	MatFormFieldModule,
	MatSortModule,
        MatExpansionModule,
	MatPaginatorModule,
	MatChipsModule,
	MatIconModule,
        MatTableModule,
	ChartsModule
    ],
    providers: [
        {
            provide: LOCALE_ID, useValue: 'en-GB'
	}, {
            provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
