import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { ResourceDetailComponent } from './resource-detail/resource-detail.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'device/:id', component: DeviceDetailComponent },
    { path: 'resource/:id', component: ResourceDetailComponent },
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
