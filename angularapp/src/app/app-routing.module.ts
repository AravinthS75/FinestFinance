import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminViewLoansComponent } from './components/admin-view-loans/admin-view-loans.component';
import { AdminViewManagersComponent } from './components/admin-view-managers/admin-view-managers.component';
import { AdminViewUsersComponent } from './components/admin-view-users/admin-view-users.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { ManagerLoanActionComponent } from './components/manager-loan-action/manager-loan-action.component';
import { ManagerViewLoanComponent } from './components/manager-view-loan/manager-view-loan.component';
import { UserApplyBikeLoanComponent } from './components/user-apply-bike-loan/user-apply-bike-loan.component';
import { UserApplyBusinessLoanComponent } from './components/user-apply-business-loan/user-apply-business-loan.component';
import { UserApplyCarLoanComponent } from './components/user-apply-car-loan/user-apply-car-loan.component';
import { UserApplyHomeLoanComponent } from './components/user-apply-home-loan/user-apply-home-loan.component';
import { UserApplyPersonalLoanComponent } from './components/user-apply-personal-loan/user-apply-personal-loan.component';
import { UserPayEmiComponent } from './components/user-pay-emi/user-pay-emi.component';
import { UserViewLoanComponent } from './components/user-view-loan/user-view-loan.component';
import { AuthguardComponent } from './components/authguard/authguard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'ADMIN' } 
  },
  { path: 'admin/view-loans',
    component: AdminViewLoansComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'ADMIN' } 
  },
  { path: 'admin/view-managers',
    component: AdminViewManagersComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'MANAGER' } 
  },
  { path: 'admin/view-users',
    component: AdminViewUsersComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'ADMIN' } 
  },
  { path: 'manager/dashboard',
    component: ManagerDashboardComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'MANAGER' } 
  },
  { path: 'manager/evaluate',
    component: ManagerLoanActionComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'MANAGER' } 
  },
  { path: 'manager/view-loans',
    component: ManagerViewLoanComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'MANAGER' } 
  },
  { path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
  },
  { path: 'user/bike-loan',
    component: UserApplyBikeLoanComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
  },
  { path: 'user/business-loan',
    component: UserApplyBusinessLoanComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
  },
  { path: 'user/car-loan',
    component: UserApplyCarLoanComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
  },
  { path: 'user/home-loan',
    component: UserApplyHomeLoanComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
  },
  { path: 'user/personal-loan',
    component: UserApplyPersonalLoanComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
  },
  { path: 'user/pay-emi',
    component: UserPayEmiComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
   },
  { path: 'user/view-loan',
    component: UserViewLoanComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
   },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
