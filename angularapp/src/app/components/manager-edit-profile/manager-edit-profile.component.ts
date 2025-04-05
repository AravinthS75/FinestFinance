import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserStoreService } from '../../services/user-store.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager-edit-profile',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './manager-edit-profile.component.html',
  styleUrl: './manager-edit-profile.component.css'
})
export class ManagerEditProfileComponent {
  editForm: FormGroup;
  profileImage: string | ArrayBuffer | null = 'assets/images/default-profile.png';
  userId: number = 0;
  token: string = '';
  isLoading: boolean = false;
  imageChanged: boolean = false;
  error: string | null = null;
  originalProfilePicture: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private userStore: UserStoreService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: [''],
      profilePicture: [''],
      mimeType: ['']
    });
  }

  ngOnInit(): void {
    const userData = this.userStore.getUser();
    if (userData) {
      this.userId = userData.userId;
      this.token = userData.token;
      this.isLoading = true;
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.userService.getUserDetails(this.userId, this.token).subscribe({
      next: (user) => {
        this.editForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address
        });
        if (user.profilePicture) {
          this.originalProfilePicture = user.profilePicture;
          this.profileImage = `data:image/jpeg;base64,${user.profilePicture}`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, SVG, and WEBP files are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.profileImage = result;
        const [metaInfo, base64Data] = result.split(',');
        const mimeType = metaInfo.split(':')[1].split(';')[0];
        this.editForm.patchValue({
          profilePicture: base64Data,
          mimeType: mimeType
        });
        this.imageChanged = true;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
        let updatedUser: any = {
        ...this.editForm.value,
        email: this.editForm.get('email')?.value
      };

      if (!this.imageChanged) {
        if (this.originalProfilePicture) {
          updatedUser.profilePicture = this.originalProfilePicture;
        } else {
          delete updatedUser.profilePicture;
          delete updatedUser.mimeType;
        }
      }
      
      this.userService.updateUserProfile(this.userId, updatedUser, this.token).subscribe({
        next: (response) => {
          this.userStore.updateUserProfile(response);
          this.router.navigate(['/manager/dashboard']);
          this.toastr.success('Profile updated successfully.', 'Update Success', {closeButton: true});
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Failed to update profile. Please try again.', 'Update Failed', {closeButton: true});
        }
      });
    }
  }

}
