import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Billing } from './components/billing/billing';
import { ContractForm } from './components/contract-form/contract-form';
import { Contracts } from './components/contracts/contracts';
import { Meters } from './components/meters/meters';
import { Rates } from './components/rates/rates';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'rates', pathMatch: 'full' },
      { path: 'rates', component: Rates },
      { path: 'meters', component: Meters },
      { path: 'billing', component: Billing },
      { path: 'contracts', component: Contracts },
      { path: 'contract-form/:roomId', component: ContractForm },
      { path: 'history/:roomId', component: History }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
