import { AuthComponent } from './pages/auth/auth.component'
import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/auth/auth.component').then((mod) => mod.AuthComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((mod) => mod.RegisterComponent),
  },
]
