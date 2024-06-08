import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryTopicsComponent } from './repository-topics.component';
import { ApiService } from 'src/app/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';

describe('RepositoryTopicsComponent', () => {
  let component: RepositoryTopicsComponent;
  let fixture: ComponentFixture<RepositoryTopicsComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
   const apiServiceSpy = jasmine.createSpyObj('ApiService' , ['getRepos']);

   await TestBed.configureTestingModule({
      declarations: [RepositoryTopicsComponent] ,
      imports: [MatCardModule],
      providers: [
        {provide : ApiService , useValue: apiServiceSpy}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RepositoryTopicsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch repositories on init' , ()=>{
       const mockRepos = [{name:'Repo 1'} , {name: 'Repo 2'}];

       apiService.getRepos.and.returnValue(of(mockRepos));

       component.gitUsername = 'testuser';
       component.ngOnInit();

       expect(apiService.getRepos).toHaveBeenCalledWith('testuser');
       expect(component.repositories).toEqual(mockRepos);
  });

  it('should accept input repos' , ()=> {
    const mockReposInput = [{name : 'InputRepo1'} , {name: 'InputRepo2'}];

    component.repos = mockReposInput;
    fixture.detectChanges();

    expect(component.repos).toEqual(mockReposInput);
  })
});
