import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() header_title: string = "";
  @Output() side_nav_event = new EventEmitter<boolean>();

  time_now: moment.Moment = moment();
  time_now_desc: string = "";

  constructor() { }

  ngOnInit(): void {
    this.time_now = moment();
    this.time_now_desc = this.time_now.format("DD MMMM YYYY - dddd");
  }


  showSideNav(){
    this.side_nav_event.emit(true);
  }

}
