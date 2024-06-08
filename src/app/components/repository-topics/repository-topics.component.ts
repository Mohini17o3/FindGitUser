import { Component, Input, NgModule, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-repository-topics',
  templateUrl: './repository-topics.component.html',
  styleUrls: ['./repository-topics.component.scss'],
})

export class RepositoryTopicsComponent implements OnInit {
  @Input() repos: any[] = [];

  gitUsername: string = '';
  profileInfo: any;
  repositories: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
if(this.gitUsername) {
  
  this.apiService.getRepos(this.gitUsername).subscribe({
    next: (repo) => {
      this.repositories = repo;
    },
    error: (error) => {
      console.error('Error fetching repositories:', error);
      this.repositories = [];
    },
  });
}


  
  }
}