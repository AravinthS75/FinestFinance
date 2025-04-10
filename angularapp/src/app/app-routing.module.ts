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
import { ManagerViewUsersComponent } from './components/manager-view-users/manager-view-users.component';
import { ManagerEditProfileComponent } from './components/manager-edit-profile/manager-edit-profile.component';
import { AdminEditProfileComponent } from './components/admin-edit-profile/admin-edit-profile.component';
import { UserEditProfileComponent } from './components/user-edit-profile/user-edit-profile.component';
import { NoAuthGuardComponent } from './components/no-auth-guard/no-auth-guard.component';
import { PersonalLoanDescriptionComponent } from './components/view-dummy/personal-loan-description/personal-loan-description.component';
import { HomeLoanDescriptionComponent } from './components/view-dummy/home-loan-description/home-loan-description.component';
import { CarLoanDescriptionComponent } from './components/view-dummy/car-loan-description/car-loan-description.component';
import { BikeLoanDescriptionComponent } from './components/view-dummy/bike-loan-description/bike-loan-description.component';
import { BusinessLoanDescriptionComponent } from './components/view-dummy/business-loan-description/business-loan-description.component';
import { BikeEmiDescriptionComponent } from './components/view-dummy/bike-emi-description/bike-emi-description.component';
import { ElectronicsEmiDescriptionComponent } from './components/view-dummy/electronics-emi-description/electronics-emi-description.component';
import { ElectronicsEmiComponent } from './components/electronics-emi/electronics-emi.component';
import { BikeEmiComponent } from './components/bike-emi/bike-emi.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'loan/personal/description',
    component: PersonalLoanDescriptionComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'loan/home/description',
    component: HomeLoanDescriptionComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'loan/car/description',
    component: CarLoanDescriptionComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'loan/bike/description',
    component: BikeLoanDescriptionComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'loan/business/description',
    component: BusinessLoanDescriptionComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'emi/bike-description',
    component: BikeEmiDescriptionComponent,
    canActivate: [NoAuthGuardComponent]
  },
  { path: 'emi/electronics-description',
    component: ElectronicsEmiDescriptionComponent,
    canActivate: [NoAuthGuardComponent]
  },
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
    data: { expectedRole: 'ADMIN' } 
  },  { path: 'admin/edit-profile',
    component: AdminEditProfileComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'ADMIN' } 
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
  { path: 'manager/view-users',
    component: ManagerViewUsersComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'MANAGER' } 
  },  { path: 'manager/edit-profile',
    component: ManagerEditProfileComponent,
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
  { path: 'user/emi-electronics',
    component: ElectronicsEmiComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' }
  },
  { path: 'user/emi-bike',
    component: BikeEmiComponent,
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
   },  { path: 'user/edit-profile',
    component: UserEditProfileComponent,
    canActivate: [AuthguardComponent], 
    data: { expectedRole: 'USER' } 
   },
   { path: 'about-us', component: AboutUsComponent },
   { path: 'contact-us', component: ContactUsComponent },
   { path: 'faq', component: FaqComponent },
   { path: 'terms-of-service', component: TermsOfServiceComponent },
   { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
