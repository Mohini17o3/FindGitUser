import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private githubUsername!: string;

  constructor(
    private httpClient: HttpClient
  ) { 
    console.log("service ready");
    this.githubUsername ="";

  }

  getUser(githubUsername: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
  }

  // implement getRepos method by referring to the documentation. Add proper types for the return type and params 

  getRepos(githubUsername: string):Observable<any> {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}/repos`);
  }
}
