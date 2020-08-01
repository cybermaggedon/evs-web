
// Routing module,  defines views.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ThreatDetailComponent } from './threat-detail/threat-detail.component';
import { AllThreatsComponent } from './all-threats/all-threats.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { RiskDashboardComponent } from './risk-dashboard/risk-dashboard.component';
import { ModelConfigurationComponent } from './model-configuration/model-configuration.component';
import { ThreatModelComponent } from './threat-model/threat-model.component';

// This table maps URLs to views.
const routes : Routes = [

    // Primary dashboard
    { path: 'dashboard', component: DashboardComponent },

    // Risk dashboard
    { path: 'risk', component: RiskDashboardComponent },

    // Model configuration
    { path: 'model', component: ModelConfigurationComponent },

    // Threat detail view
    { path: 'threat/:id', component: ThreatDetailComponent },

    // Threat detail view
    { path: 'all-threats', component: AllThreatsComponent },

    // Threat detail view
    { path: 'threat-model/:name', component: ThreatModelComponent },

    // Category detail view
    { path: 'category/:id', component: CategoryDetailComponent },

    // No URL, and not-known, redirects to /dashboard.
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },

];

// Routing module
@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
