import { Component} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  gitUsername: string = '';
  userNotFound: boolean =false;
  


  constructor(private router: Router , private apiService: ApiService) {}


  searchUser() {

 if (this.gitUsername) {
    
  this.apiService.getUser(this.gitUsername).subscribe(profileInfo=>{
  if(profileInfo){
    this.userNotFound = false;
    this.router.navigate(['/profile', this.gitUsername]);
  }else{
    this.userNotFound = true;
  } 
  },
  error =>{
    console.error("Error fetching requested data" , error);
    this.userNotFound =true;
  }
  );
 } else {
  this.userNotFound = true;
 }  
}



}