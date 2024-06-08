import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {MatPaginatorModule , MatPaginator} from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'] ,

})
export class ProfileComponent implements OnInit , AfterViewInit{

  repo:any[] = [];
  profileInfo:any;
  gitUsername :string ='';
  paginatedReposArray: any[] = [];
  length = 0 ;
  pageSize = 10;
  pageSizeOptions: number[] = [10 , 20 , 40 , 60 , 80 , 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gitUsername = params['username'];
      if (this.gitUsername) {
        this.fetchProfileData();
      }
    });
  }

  fetchProfileData(): void {
    if (this.gitUsername) {
      this.apiService.getUser(this.gitUsername).subscribe({
        next: (profileInfo) => {
          this.profileInfo = profileInfo;
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
          this.profileInfo = null;
        }
      });

      this.apiService.getRepos(this.gitUsername).subscribe({
        next: (repo) => {
          this.repo = repo;
          this.length = repo.length; // dynamic length for pagination
          this.paginatedRepo({ pageIndex: 0, pageSize: this.pageSize } as PageEvent); // Initial pagination
        },
        error: (error) => {
          console.error('Error fetching repositories:', error);
          this.repo = [];
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((pageEvent) => this.paginatedRepo(pageEvent));
    }
  }

  paginatedRepo(pageEvent: PageEvent): void {
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.paginatedReposArray = this.repo.slice(startIndex, endIndex);
  }
}