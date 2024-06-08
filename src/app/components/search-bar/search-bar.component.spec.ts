import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;
  

  beforeEach(async () => {
   const apiServiceSpy = jasmine.createSpyObj('ApiService' , ['getUser']);
   const routerSpy = jasmine.createSpyObj('Router' ,['navigate']);
    

    await TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [FormsModule],
     providers: [

      {provide: ApiService , useValue: apiServiceSpy},
      {provide: Router, useValue: routerSpy}
     ]

    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search user and navigate if profile found' , ()=>{

    const mockProfile = {name: 'Test User'} ;
    apiService.getUser.and.returnValue(of(mockProfile));
    component.gitUsername = 'testuser';

    component.searchUser();

    expect(apiService.getUser).toHaveBeenCalledWith('testuser');
    expect(component.userNotFound).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/profile' , 'testuser']);

    

  });

  it('should set userNotFound to true when user is not found ', () =>{
    apiService.getUser.and.returnValue(of(null));
    component.gitUsername = 'testuser';
    component.searchUser();

    expect(apiService.getUser).toHaveBeenCalledWith('testuser');
    expect(component.userNotFound).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle error when searching for a user' , ()=>{
    apiService.getUser.and.returnValue(throwError(()=>{
      "Error fetching data";
    } ) );

    component.gitUsername = 'testuser';
    component.searchUser();

    expect(apiService.getUser).toHaveBeenCalledWith('testuser');
    expect(component.userNotFound).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();

  });

  it('should set userNotFound to true if gitUsername is empty' , ()=>{
    component.gitUsername = '';

    component.searchUser();

    expect(apiService.getUser).not.toHaveBeenCalled();
    expect(component.userNotFound).toBeTrue();

  }) ;

});
