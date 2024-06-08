import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ApiService } from 'src/app/services/api.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { fakeAsync , tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getRepos', 'getUser']);

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [MatPaginatorModule, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ username: 'testuser' }) }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display profile info on init', () => {
    const mockProfileInfo = { name: 'Test User' };
    const mockRepos = [{ name: 'Repo1' }, { name: 'Repo2' }];

    apiService.getUser.and.returnValue(of(mockProfileInfo));
    apiService.getRepos.and.returnValue(of(mockRepos));

    fixture.detectChanges();

    expect(apiService.getUser).toHaveBeenCalledWith('testuser');
    expect(apiService.getRepos).toHaveBeenCalledWith('testuser');

    fixture.whenStable().then(() => {
      fixture.detectChanges(); 

      expect(component.profileInfo).toEqual(mockProfileInfo);
      expect(component.repo).toEqual(mockRepos);
      expect(component.length).toBe(mockRepos.length);
      expect(component.paginatedReposArray).toEqual(mockRepos.slice(0, component.pageSize));
      
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelectorAll('app-repository-topics').length).toBe(1);
    });
  
  });

  it('should handle error fetching profile info', () => {
    apiService.getUser.and.returnValue(throwError(() => "error fetching data"));
    apiService.getRepos.and.returnValue(of([]));

    component.ngOnInit();

    expect(apiService.getUser).toHaveBeenCalledWith('testuser');
    expect(component.profileInfo).toBeNull();
    expect(component.repo.length).toBe(0);
  });

  it('should handle pagination', () => {
    const mockRepos = Array.from({ length: 25 }, (_, i) => ({ name: `Repo${i + 1}` }));

    component.repo = mockRepos;
    component.length = mockRepos.length;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
     
    component.paginator.pageSize = 10;
    component.paginator.pageIndex = 0;
 
    component.paginatedRepo({ pageIndex: 0, pageSize: 10 } as PageEvent);
    expect(component.paginatedReposArray.length).toBe(10);
    expect(component.paginatedReposArray[0].name).toBe('Repo1');
    expect(component.paginatedReposArray[1].name).toBe('Repo2');

  });

  });

  it('should subscribe to paginator page events', fakeAsync(() => {
    spyOn(component, 'paginatedRepo');

    apiService.getUser.and.returnValue(of({ name: 'Test User' }));
    apiService.getRepos.and.returnValue(of([{ name: 'Repo1' }, { name: 'Repo2' }]));

    fixture.detectChanges();
    tick(); // Simulate the passage of time for ngOnInit and ngAfterViewInit

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance;
      paginator.page.emit({ pageIndex: 1, pageSize: 10 });

      tick(); // Simulate the passage of time for the event to be processed

      expect(component.paginatedRepo).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 } as PageEvent);
    });
  }));
});