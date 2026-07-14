import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing_page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
