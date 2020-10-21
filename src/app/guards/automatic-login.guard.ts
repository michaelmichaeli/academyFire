import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutomaticLoginGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = route.data.role;

    return this.auth.user.pipe(
      take(1),
      map(user => {
        console.log('user in here: ', user);
        if (!user) {
          return true;
        } else {
          const role = user['role'];
          if ('BUYER' == role) {
            this.router.navigateByUrl('/buyer');
          } else if ('SELLER' == role) {
            this.router.navigateByUrl('/seller');
          }
          return false;
        }
      })
    )
  }
  
}
