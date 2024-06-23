import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomepageService } from '../../../services/homepage/home.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userData: User | null = null;

  constructor(private homepageService: HomepageService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  private loadHomeData(): void {
    this.homepageService.getHomeData().subscribe({
      next: (data) => {
        this.userData = data.user;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching user data', error);
      }
    });
  }
}
