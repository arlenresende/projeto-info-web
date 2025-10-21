import { Component } from '@angular/core'
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component' // 👈 ajuste o caminho conforme sua pasta

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [AuthLayoutComponent],
})
export class RegisterComponent {}
