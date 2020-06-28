import { Component, OnInit } from '@angular/core';
import {AuthService} from '../common/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'dsjt-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    try {
       const returnUrl = await this.authService.handleCallback(this.router.url);
       await this.router.navigateByUrl(returnUrl);
    } catch (err) {
      if (err.message.indexOf('No matching state') !== -1) {
        await this.router.navigateByUrl('/');
      } else {
        this.errorMessage = err.message;
      }
    }
  }
}
