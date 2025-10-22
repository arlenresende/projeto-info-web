import { Component } from '@angular/core'
import { SidebarComponent } from '../../../components/sidebar/sidebar.component'
import { HeaderComponent } from '../../../components/header/header.component'
import { CardComponent } from '../../../components/card/card.component'

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, HeaderComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
