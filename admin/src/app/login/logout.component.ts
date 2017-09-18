import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../common/services/auth.service';

@Component({
  selector: 'dsjt-logout',
  template: ``
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
