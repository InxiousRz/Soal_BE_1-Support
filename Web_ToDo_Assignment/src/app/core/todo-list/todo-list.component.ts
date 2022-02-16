import { Component, OnInit, Input, EventEmitter, OnChanges, SimpleChanges  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import * as moment from 'moment-timezone';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnChanges {

  @Input('filter_identifier') applied_filter_identifier: 1 | 2 | 3 | 4 = 1;
  @Input('ref_trigger') ref_trigger: number = 1;

  todo_data_key_list: any[] = [];
  todo_data: any = {};
  todo_data_count: any;
  task_view_mode: number = 1;
  task_loading_state: boolean = true;

  ngclass_box_formation: any;
  ngclass_rectangle_formation: any;
  
  constructor(private modalService: NgbModal, private apiService: ApiService) { 

    this.ngclass_box_formation = {
      "box-formation-but": true,
      "selected": true
    }

    this.ngclass_rectangle_formation = {
      "box-formation-but": true,
      "selected":false
    }

    
   }

  ngOnChanges(changes: SimpleChanges) : void {
    // changes.prop contains the old and the new value...

    this.task_loading_state = true;
    this.apiService.loadConfig().subscribe((data: any)=>{
      this.apiService.setConfig(
        data,
        data["Main_URL"]
      );

      this.loadToDoList()
      .subscribe(([success, result])=>{
        console.log(success)
        console.log(result)
        if(success){
          let pagination_data = result["Pagination_Data"];
          let data = result["List_Data"];
          data = this.formatToDoList(data);
          this.todo_data_count = data["Count_Task_Total"];
          this.todo_data = data["Group_Data"];
          this.todo_data_key_list = Object.keys(this.todo_data);
        }
        this.task_loading_state = false;
      });
    
    });

    
    

  }

  formatToDoList(todo_list: any[]){

    let task_count: number = todo_list.length;
    let group_result: any = {};

    todo_list.forEach((element: any)=>{

      // DATE STRING
      let date_string = moment.unix(element["Action_Time"]).format("DD MMMM YYYY");

      if(Object.keys(group_result).indexOf(date_string) === -1){
        group_result[date_string] = {
          "String_Created_Date": moment.unix(element["Action_Time"]).format("DD MMMM YYYY"),
          "String_Day": moment.unix(element["Action_Time"]).format("dddd"),
          "Task_List": []
        };
      }


      let counter_data: any = {
        "Count_All": element["Objective_List"].length,
        "Count_Finish": 0,
        "Count_Unfinish": 0
      };
      let objective_string_list: string[] = [];

      let objective_list = element["Objective_List"].map((sub_element: any)=>{

        if(sub_element["Is_Finished"]){
          counter_data["Count_Finish"] += 1;
        } else {
          counter_data["Count_Unfinish"] += 1;
        }

        objective_string_list.push(sub_element["Objective_Name"]);

        return {
          ...sub_element,
          "String_Created_Date": moment.unix(sub_element["Action_Time"]).format("DD MMMM YYYY")
        };
        
      })

      element["Objective_List"] = objective_list;
      group_result[date_string]["Task_List"].push({
        ...element,
        "String_Created_Date": moment.unix(element["Action_Time"]).format("DD MMMM YYYY"),
        "String_Day": moment.unix(element["Action_Time"]).format("dddd"),
        "Sumary_String": objective_string_list.join(", "),
        "Last_Update_String": moment.unix(element["Updated_Time"]).format("DD MMMM YYYY"),
        "Counter_Data": counter_data
      })
    });

    return {
      "Count_Task_Total": task_count,
      "Group_Data": group_result
    };

  }

  loadToDoList(){
    let time_now = moment();
    let date_now = time_now.startOf("day");

    // TODAY
    if(this.applied_filter_identifier === 1){


      return this.apiService.loadTask(
        null,
        date_now.unix(),
        date_now.add(1, "days").subtract(1, "seconds").unix(),
        false
      );

    }

    // LEFTOVER
    if(this.applied_filter_identifier === 2){

      return this.apiService.loadTask(
        null,
        null,
        date_now.subtract(1, "seconds").unix(),
        false
      );

    }

    // UPCOMING
    if(this.applied_filter_identifier === 3){

      return this.apiService.loadTask(
        null,
        date_now.add(1, "days").unix(),
        null,
        false
      );

    }

    // ALL DATA
    if(this.applied_filter_identifier === 4){

      return this.apiService.loadTask(
        null,
        null,
        null,
        false
      );

    }

    return new Observable<any>((observer) => {
      observer.next(null);
    });

  }

  cutText(text: string){
    let cut_text:string = "";
    cut_text = text.slice(0, 100).trimEnd();
    if(text.length > 100){
      cut_text += "...";
    }
    return cut_text;
  }

  cutTitle(text: string){
    let cut_text:string = "";
    cut_text = text.slice(0, 60).trimEnd();
    if(text.length > 60){
      cut_text += "...";
    }
    return cut_text;
  }

  openDetailForm(objective_id: number){
    const modalRef = this.modalService.open(TaskDetailComponent, { size: 'xl', scrollable: true, centered: true });
    modalRef.componentInstance.name = 'Objective Detail Page';
    modalRef.componentInstance.task_id = objective_id;
    

    // modalRef.dismissed.subscribe((data)=>{
    //   console.log("=============== DISSMISS  ==");
    //   console.log(data);
    // });

    modalRef.closed.subscribe((data)=>{

      if(data === true){

        this.task_loading_state = true;
        this.loadToDoList()
        .subscribe(([success, result])=>{
          console.log(success)
          console.log(result)
          if(success){
            let pagination_data = result["Pagination_Data"];
            let data = result["List_Data"];
            data = this.formatToDoList(data);
            this.todo_data_count = data["Count_Task_Total"];
            this.todo_data = data["Group_Data"];
            this.todo_data_key_list = Object.keys(this.todo_data);
          }
          this.task_loading_state = false;
        });

      }
      

    });

    // modalRef.hidden.subscribe((data)=>{
    //   console.log("=============== HIDDEN  ==");
    //   console.log(data);
    // });
  }

  changeViewMode(identifier: number){

    if(identifier === 1){
      this.ngclass_box_formation.selected = true
      this.ngclass_rectangle_formation.selected = false
    }

    if(identifier === 2){
      this.ngclass_box_formation.selected = false
      this.ngclass_rectangle_formation.selected = true
    }

    this.task_view_mode = identifier;
  }

}
