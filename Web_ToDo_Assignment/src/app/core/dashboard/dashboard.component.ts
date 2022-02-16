import { Component, OnInit } from '@angular/core';
import { TaskFormComponent } from '../task-form/task-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  header_title: string = "Dashboard";

  ngclass_filter_today: any;
  ngclass_filter_leftover: any;
  ngclass_filter_upcoming: any;
  ngclass_filter_all: any;
  applied_filter_identifier: 1 | 2 | 3 | 4 = 1;
  ref_trigger: number = 1;
  show_sidenav: boolean = false;

  dashboard_class: any;

  constructor(private modalService: NgbModal, private apiService: ApiService) {

    this.ngclass_filter_today = {
      "filter-but": true,
      "selected": true
    };

    this.ngclass_filter_leftover = {
      "filter-but": true,
      "selected": false
    };

    this.ngclass_filter_upcoming = {
      "filter-but": true,
      "selected": false
    };
    
    this.ngclass_filter_all = {
      "filter-but": true,
      "selected": false
    };

    this.dashboard_class = {
      "wide": true,
      "tall": true,
      "flex-c-cs": true,
      "no-scroll": false
    }

    this.apiService.loadConfig();

  }

  ngOnInit(): void {
  }


  applyFilter(identifier: 1 | 2 | 3 | 4 ){

    if(identifier === this.applied_filter_identifier){
      return;
    }

    if(identifier === 1){
      this.ngclass_filter_today.selected = true;
      this.ngclass_filter_leftover.selected = false;
      this.ngclass_filter_upcoming.selected = false;
      this.ngclass_filter_all.selected = false;
    }

    if(identifier === 2){
      this.ngclass_filter_today.selected = false;
      this.ngclass_filter_leftover.selected = true;
      this.ngclass_filter_upcoming.selected = false;
      this.ngclass_filter_all.selected = false;
    }

    if(identifier === 3){
      this.ngclass_filter_today.selected = false;
      this.ngclass_filter_leftover.selected = false;
      this.ngclass_filter_upcoming.selected = true;
      this.ngclass_filter_all.selected = false;
    }

    if(identifier === 4){
      this.ngclass_filter_today.selected = false;
      this.ngclass_filter_leftover.selected = false;
      this.ngclass_filter_upcoming.selected = false;
      this.ngclass_filter_all.selected = true;
    }


    this.applied_filter_identifier = identifier;

  }

  
  openNewForm(){
    const modalRef = this.modalService.open(TaskFormComponent, { size: 'xl', scrollable: true, centered: true, backdrop: 'static' });
    modalRef.componentInstance.form_type = "ADD";
    modalRef.componentInstance.task_data = {};

    modalRef.closed.subscribe((data)=>{

      if(data === true){

        this.ref_trigger += 1;
        
      }
      

    });

    
  }

  sideNavHandler(state: boolean){

    if(state == true){
      this.show_sidenav = true;
    } else {
      this.show_sidenav = false;
    }
    

  }

}
