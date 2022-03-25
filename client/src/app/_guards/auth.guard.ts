import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import{map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (private account:AccountService,private toastr:ToastrService)
  {

  }
  canActivate(): Observable<boolean>{
    return this.account.currentUser$.pipe(
      map(user => {
        if(user) return true;
        this.toastr.error('you shall not pass!');
        return false
      })
    )
  }
  
}
