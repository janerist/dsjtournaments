import {Component, OnInit} from '@angular/core';
import {AuthService} from '../common/services/auth.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'dsjt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const {username, password} = this.loginForm.value;

    this.authService
      .login(username, password)
      .then(redirectUrl => {
        this.router.navigate([redirectUrl]);
      }, (err: string) => {
        this.loginError = err;
      });
  }
}
