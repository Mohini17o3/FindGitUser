import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data from GitHub API', () => {
    const mockUser = { login: 'testuser', id: 1, name: 'Test User' };
    const githubUsername = 'testuser';

    service.getUser(githubUsername).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should fetch user repositories from GitHub API', () => {
    const mockRepos = [
      { id: 1, name: 'Repo1' },
      { id: 2, name: 'Repo2' }
    ];
    const githubUsername = 'testuser';

    service.getRepos(githubUsername).subscribe(repos => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}/repos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should handle HTTP error response for getUser', () => {
    const githubUsername = 'nonexistentuser';

    service.getUser(githubUsername).subscribe({
      next: () => fail('expected an error, not user data'),
      error: error => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}`);
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle HTTP error response for getRepos', () => {
    const githubUsername = 'nonexistentuser';

    service.getRepos(githubUsername).subscribe({
      next: () => fail('expected an error, not repositories'),
      error: error => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}/repos`);
    req.flush('Repositories not found', { status: 404, statusText: 'Not Found' });
  });
});
