import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ThreatDetailComponent } from './threat-detail/threat-detail.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { RiskDashboardComponent } from './risk-dashboard/risk-dashboard.component';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'risk', component: RiskDashboardComponent },
    { path: 'threat/:id', component: ThreatDetailComponent },
    { path: 'category/:id', component: CategoryDetailComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
