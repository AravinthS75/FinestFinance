import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserStoreService } from '../../services/user-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-edit-profile',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './admin-edit-profile.component.html',
  styleUrl: './admin-edit-profile.component.css'
})
export class AdminEditProfileComponent implements OnInit{
  editForm: FormGroup;
  // This is used for the preview image
  profileImage: string | ArrayBuffer | null = 'assets/images/default-profile.png';
  // uploadImage: string | null = 'assets/images/Upload-Silhouettes.png';
  // Store user id and token for API calls
  userId: number = 0;
  token: string = '';
  isLoading: boolean = false;
  // Flag to indicate if a new image file was selected
  imageChanged: boolean = false;
  // Store the original profile picture (base64 string without the data prefix)
  originalProfilePicture: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private userStore: UserStoreService,
    private router: Router
  ) {
    // Initialize the form. Note that the image fields start empty.
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
        // Patch the text fields from the loaded user data.
        this.editForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address
        });
        // If the user has a profile picture, store its base64 data and show it.
        if (user.profilePicture) {
          // Save the original image data (assumed to be the base64 string from the backend)
          this.originalProfilePicture = user.profilePicture;
          // For display purposes, prepend the data URL prefix.
          this.profileImage = `data:image/jpeg;base64,${user.profilePicture}`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user data', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Allowed MIME types for image uploads.
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, SVG, and WEBP files are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Update the preview with the selected image.
        this.profileImage = result;
        // Extract the base64 data and MIME type from the result.
        const [metaInfo, base64Data] = result.split(',');
        const mimeType = metaInfo.split(':')[1].split(';')[0];
        // Patch the form with the new image data.
        this.editForm.patchValue({
          profilePicture: base64Data,
          mimeType: mimeType
        });
        // Mark that a new image was selected.
        this.imageChanged = true;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      // Build the payload from form values. The email is taken from the control (even though it is disabled).
      let updatedUser: any = {
        ...this.editForm.value,
        email: this.editForm.get('email')?.value
      };

      if (!this.imageChanged) {
        // No new image was selected.
        // If there is an original image, include it in the payload.
        if (this.originalProfilePicture) {
          updatedUser.profilePicture = this.originalProfilePicture;
          // Optionally, you may set a default mimeType if required by your backend.
          // For example: updatedUser.mimeType = 'image/jpeg';
        } else {
          // Otherwise, remove the image fields so they are not sent.
          delete updatedUser.profilePicture;
          delete updatedUser.mimeType;
        }
      }
      
      this.userService.updateUserProfile(this.userId, updatedUser, this.token).subscribe({
        next: (response) => {
          // Update the user store and navigate back to the dashboard.
          this.userStore.updateUserProfile(response);
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Update failed', err);
        }
      });
    }
  }
}
