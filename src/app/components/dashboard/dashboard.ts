import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  
})
export class Dashboard {

}
