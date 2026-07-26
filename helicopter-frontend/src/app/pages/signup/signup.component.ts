import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  loading = false;
  errorMessage = '';
  successMessage = '';
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.signupForm = this.fb.group({

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

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
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    });

  }

  onSubmit(): void {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // Check password confirmation
    if (
      this.signupForm.value.password !==
      this.signupForm.value.confirmPassword
    ) {

      alert("Passwords do not match");
      return;

    }

    this.authService.register({

      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password

    }).subscribe({

      next: () => {

        alert("Registration Successful!");

        this.router.navigate(['/login']);

      },

      error: (error) => {

        console.error(error);

        if (error.status === 400) {
          alert("Email or username already exists.");
        } else {
          alert("Registration failed.");
        }

      }

    });

  }

}