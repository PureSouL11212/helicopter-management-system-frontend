import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });

  }

  onSubmit(): void {

     this.errorMessage = '';

    // clear any previous logs/values for security

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {

        this.loading = false;

        // store tokens in sessionStorage (less persistent than localStorage)
        if (response && response.access) {
          sessionStorage.setItem('access', response.access);
        }
        if (response && response.refresh) {
          sessionStorage.setItem('refresh', response.refresh);
        }

        // Test the JWT interceptor
        this.authService.getProfile().subscribe({
          next: (res) => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error("Profile failed:", error);
          }
        });
      },
      error: (error) => {

        this.loading = false;

        console.error(error);

        if (error && error.status === 401) {

          this.errorMessage = "Invalid email or password.";

        } else if (error && error.status === 0) {

          this.errorMessage = "Cannot connect to the server.";

        } else if (error && error.status === 403) {

          this.errorMessage = "Your session has expired.";

        } else {

          this.errorMessage = "Something went wrong. Please try again.";

        }

      }
    });
  }
}