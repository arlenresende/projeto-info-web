import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component'
import { AuthService } from '../../../core/services/auth/auth.service'
import { LoadingService } from '../../../core/services/loading/loading.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  imports: [AuthLayoutComponent, ReactiveFormsModule, CommonModule, RouterModule],
})
export class AuthComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private loadingService = inject(LoadingService)
  private toastr = inject(ToastrService)
  private router = inject(Router)

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  get isLoading() {
    return this.loadingService.isLoading
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loadingService.show()
      
      const loginData = this.loginForm.value
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.loadingService.hide()
          sessionStorage.setItem('info-token', response.token)
          this.toastr.success('Login realizado com sucesso!', 'Bem-vindo!')
          this.router.navigate(['/home'])
        },
        error: (error) => {
          this.loadingService.hide()
          const errorMessage = error.error?.message || 'Erro ao fazer login. Verifique suas credenciais.'
          this.toastr.error(errorMessage, 'Erro no Login')
        }
      })
    } else {
      this.markFormGroupTouched()
      this.toastr.warning('Por favor, preencha todos os campos corretamente.', 'Atenção')
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'email' ? 'Email' : 'Senha'} é obrigatório`
      }
      if (field.errors['email']) {
        return 'Email inválido'
      }
      if (field.errors['minlength']) {
        return 'Senha deve ter pelo menos 6 caracteres'
      }
    }
    return ''
  }
}
