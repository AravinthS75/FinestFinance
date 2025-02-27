import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-view-managers',
  standalone: false,
  
  templateUrl: './admin-view-managers.component.html',
  styleUrl: './admin-view-managers.component.css'
})
export class AdminViewManagersComponent {
  managers:User[] = [];
  userData: string | null = null;
  token : string = '';

  constructor(private adminService: AdminService){
    this.userData = sessionStorage.getItem('authUser');
    if (this.userData) {
      const userDetails = JSON.parse(this.userData);
      this.token = userDetails.token;
    } else {
      console.error('No user data found in sessionStorage');
    }
  }

  ngOnInit(): void {
      this.adminService.getAllManagers(this.token).subscribe(
        (data) => {
            this.managers = data;
            console.log(this.managers);
        }
      );
  }


}
