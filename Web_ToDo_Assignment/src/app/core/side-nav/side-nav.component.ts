import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Output() side_nav_event = new EventEmitter<boolean>();

  constructor( private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }


  hideSideNav(){
    this.side_nav_event.emit(false);
  }

  goToSearch(){
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    this.hideSideNav();
    this.router.navigate(['/search']);
  }

  goToDashboard(){
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    this.hideSideNav();
    this.router.navigate(['/dashboard']);
  }

}
