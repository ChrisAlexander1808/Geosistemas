import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, UrlTree, Router, RouterStateSnapshot } from '@angular/router';
import { clearScreenDown } from 'readline';
import { Observable } from 'rxjs';
import { TestService } from '../services/test.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private _router:Router,
    private _testService:TestService,
  ){}

  canActivate():any{
    let access:any = this._testService.isAuthenticate();

    if (!access) {
      this._router.navigate([''])
    }

    return true;
  }
  
}
