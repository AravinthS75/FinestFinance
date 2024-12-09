import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { AdminViewLoansComponent } from './components/admin-view-loans/admin-view-loans.component';
import { AdminViewManagersComponent } from './components/admin-view-managers/admin-view-managers.component';
import { AdminViewUsersComponent } from './components/admin-view-users/admin-view-users.component';
import { AuthguardComponent } from './components/authguard/authguard.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { ManagerLoanActionComponent } from './components/manager-loan-action/manager-loan-action.component';
import { ManagerNavbarComponent } from './components/manager-navbar/manager-navbar.component';
import { ManagerViewLoanComponent } from './components/manager-view-loan/manager-view-loan.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { UserApplyBikeLoanComponent } from './components/user-apply-bike-loan/user-apply-bike-loan.component';
import { UserApplyBusinessLoanComponent } from './components/user-apply-business-loan/user-apply-business-loan.component';
import { UserApplyCarLoanComponent } from './components/user-apply-car-loan/user-apply-car-loan.component';
import { UserApplyHomeLoanComponent } from './components/user-apply-home-loan/user-apply-home-loan.component';
import { UserApplyPersonalLoanComponent } from './components/user-apply-personal-loan/user-apply-personal-loan.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';
import { UserPayEmiComponent } from './components/user-pay-emi/user-pay-emi.component';
import { UserViewLoanComponent } from './components/user-view-loan/user-view-loan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserStoreService } from './services/user-store.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    AdminNavbarComponent,
    AdminViewLoansComponent,
    AdminViewManagersComponent,
    AdminViewUsersComponent,
    AuthguardComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    ManagerDashboardComponent,
    ManagerLoanActionComponent,
    ManagerNavbarComponent,
    ManagerViewLoanComponent,
    NavbarComponent,
    RegisterComponent,
    UserApplyBikeLoanComponent,
    UserApplyBusinessLoanComponent,
    UserApplyCarLoanComponent,
    UserApplyHomeLoanComponent,
    UserApplyPersonalLoanComponent,
    UserDashboardComponent,
    UserNavbarComponent,
    UserPayEmiComponent,
    UserViewLoanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    UserStoreService,
    AuthguardComponent,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
