import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  standalone:true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
   encapsulation: ViewEncapsulation.None, // 👈 import this from @angular/core
})
export class Sidebar {

}
