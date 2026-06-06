import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = signal(false);
  resending = signal(false);
  error = signal('');
  email = signal('');

  form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email.set(params['email'] || '');
    });
  }

  submit(): void {
    if (this.form.invalid || !this.email()) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.verifyOtp({ email: this.email(), otp: this.form.value.otp! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/feed']);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error || 'Invalid OTP. Please try again.');
      }
    });
  }

  resend(): void {
    if (!this.email()) return;
    this.resending.set(true);
    this.auth.resendOtp(this.email()).subscribe({
      next: () => this.resending.set(false),
      error: () => this.resending.set(false)
    });
  }
}
