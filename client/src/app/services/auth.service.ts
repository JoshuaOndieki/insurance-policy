import {Injectable, signal} from '@angular/core';
import {AbstractHttpService} from './http.abstract';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
// import {ResetPasswordRequest, SigninResponse, SignupResponse, User, UserSignup} from '../../types';
import {catchError, map, of, tap, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {SigninResponse, User, UserSignin, UserSignup} from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AbstractHttpService{
  private readonly baseUrl = environment.APIUrl
  authUser = signal<User | null>(null)

  constructor(http: HttpClient, private router: Router) {
    super(http);
    const u = localStorage.getItem('InsuredUser')
    if(u) this.authUser.set(JSON.parse(u))
  }

  signup(signupData: UserSignup) {
    return this.post(this.baseUrl + 'register', signupData).pipe(tap({
      next: (res)=> console.log('after signup', res)
    }))
  }

  signin(signinData: UserSignin ) {
    return this.post<SigninResponse>(this.baseUrl + 'login', signinData).pipe(tap({
      next: (res)=> {
        localStorage.setItem('InsuredAccess', JSON.stringify(res))
        this.me().subscribe({
          next: (res)=> {
            localStorage.setItem('InsuredUser', JSON.stringify(res))
            window.location.reload()
          },
          error: (err)=> {
            this.signout()
          }
      })
      }
    }));
  }

  signout() {
    localStorage.removeItem('InsuredAccess');
    localStorage.removeItem('InsuredUser');
    this.authUser.set(null)
    window.location.reload()
  }

  me() {
    return this.get<User>(this.baseUrl + "manage/info");
  }

  refresh() {
    // TODO: Auto refresh
    const access = localStorage.getItem('InsuredAccess');
    const refreshToken = access ? (JSON.parse(access) as SigninResponse).refreshToken : "";

    return this.post<SigninResponse>(this.baseUrl + 'refresh', {refreshToken}).pipe(tap({
      next: (res)=> {
        localStorage.setItem('InsuredAccess', JSON.stringify(res))
      }
    }));
  }

}
