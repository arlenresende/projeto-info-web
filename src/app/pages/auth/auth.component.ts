import { Component } from '@angular/core'
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component'

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  imports: [AuthLayoutComponent],
})
export class AuthComponent {}
