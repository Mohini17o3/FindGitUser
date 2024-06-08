import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let routerEventsSubject: Subject<Event>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<Event>();

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should show overlay on NavigationStart', () => {
    routerEventsSubject.next(new NavigationStart(1, '/test'));
    expect(component.showOverlay).toBeTrue();
  });

  it('should hide overlay on NavigationEnd', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));
    expect(component.showOverlay).toBeFalse();
  });

  it('should hide overlay on NavigationCancel', () => {
    routerEventsSubject.next(new NavigationCancel(1, '/test', ''));
    expect(component.showOverlay).toBeFalse();
  });

  it('should hide overlay on NavigationError', () => {
    routerEventsSubject.next(new NavigationError(1, '/test', new Error('Test Error')));
    expect(component.showOverlay).toBeFalse();
  });
});
