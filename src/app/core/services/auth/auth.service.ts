import { inject, Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { ApiService } from '../api/api.service'
import { LoginRequest, LoginResponse } from '../../DTO/login.dto'
import { RegisterRequest, RegisterResponse } from '../../DTO/register.dto'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService)

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.api.post('login', payload)
  }

  signUp(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.api.post('register', payload)
  }
}
