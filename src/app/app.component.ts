import { Component} from '@angular/core';

import{
  Router , 
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd , 
  NavigationCancel,
  NavigationError
}  from '@angular/router'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
public showOverlay = true ;

constructor(private router :Router) {
  router.events.subscribe((event: RouterEvent)=>{
    this.navigationInterceptor(event)
  })
}

navigationInterceptor(event :RouterEvent) :void{
  if(event instanceof NavigationStart){
    this.showOverlay = true;
  }
  
  if(event instanceof NavigationEnd){
    this.showOverlay = false;
}
if(event instanceof NavigationCancel) {
  this.showOverlay = false;
}

if(event instanceof NavigationError ) {

  this.showOverlay =false;

}



}
}

