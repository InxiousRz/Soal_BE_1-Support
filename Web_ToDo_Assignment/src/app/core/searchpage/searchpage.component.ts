import { Component, OnInit, Injectable, ViewChild, Input } from '@angular/core';
import * as moment from 'moment-timezone';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { FormGroup, FormControl,  Validators } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbPagination, NgbPaginationPages } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? (date.day.toString().length == 1 ? "0" + date.day.toString() : date.day) + 
    this.DELIMITER + 
    (date.month.toString().length == 1 ? "0" + date.month.toString() : date.month) + 
    this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '-';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? (date.day.toString().length == 1 ? "0" + date.day.toString() : date.day) + 
    this.DELIMITER + 
    (date.month.toString().length == 1 ? "0"+ date.month.toString() : date.month) + 
    this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SearchpageComponent implements OnInit {

  header_title: string = "Search";

  search_title: string = "";
  search_date_start: string = moment().format("DD-MM-YYYY");
  search_date_end: string = "";

  last_search_title: string | null = null;
  last_search_date_start: number | null = null;
  last_search_date_end: number | null = null;

  page: number = 1;
  data_per_page: number = 5;
  total_data: number = 5;

  search_title_error: string = "";
  search_date_start_error: string = "";
  search_date_end_error: string = "";

  search_loading_state: boolean = false;
  search_btn_loading_state: boolean = false;
  todo_data_list: any[] = [];
  show_sidenav: boolean = false;

  constructor(private modalService: NgbModal, private apiService: ApiService) { 

    this.apiService.loadConfig();

  }

  ngOnInit(): void {

    let date_now = moment().startOf("day").unix();
    
    this.search_loading_state = true;

    this.apiService.loadConfig().subscribe((data: any)=>{
      this.apiService.setConfig(
        data,
        data["Main_URL"]
      );

      this.loadToDoList(
        null,
        date_now,
        null,
        1,
        this.data_per_page
      ).subscribe(([success, result])=>{
        console.log(success);
        console.log(result);
        let pagination_data = result["Pagination_Data"];
        this.total_data = pagination_data["Total_All_Data"];
        this.data_per_page = pagination_data["Max_Data_Per_Page"];
  
        // if (this.total_data == 0){
        //   this.total_data = this.data_per_page;
        // }
  
        this.last_search_title = this.search_title;
        this.last_search_date_start = date_now;
        this.last_search_date_end = null;
  
        let data = result["List_Data"];
        this.todo_data_list = this.formatToDoList(data);
        
        this.search_loading_state = false;

      });

    })

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

        
        this.search_loading_state = true;

        this.loadToDoList(
          this.last_search_title,
          this.last_search_date_start,
          this.last_search_date_end,
          this.page,
          this.data_per_page
        ).subscribe(([success, result])=>{
          console.log(success);
          console.log(result);
          let pagination_data = result["Pagination_Data"];
          this.total_data = pagination_data["Total_All_Data"];
          this.data_per_page = pagination_data["Max_Data_Per_Page"];
    
          // if (this.total_data == 0){
          //   this.total_data = this.data_per_page;
          // }
    
          let data = result["List_Data"];
          this.todo_data_list = this.formatToDoList(data);
          
          this.search_loading_state = false;
        });

      }
      

    });

    // modalRef.hidden.subscribe((data)=>{
    //   console.log("=============== HIDDEN  ==");
    //   console.log(data);
    // });
  }

  loadToDoList(title: string | null, start: number | null, end: number | null, page: number, limit: number){
    let time_now = moment();
    let date_now = time_now.startOf("day");

    return this.apiService.loadTask(
      title,
      start,
      end,
      null,
      page,
      limit
    );

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


  formatToDoList(todo_list: any[]){

    let rev_todo_list: any = [];

    rev_todo_list = todo_list.map((element: any)=>{

      let count_data = {
        "Count_All": element["Objective_List"].length,
        "Count_Finish": 0,
        "Count_Unfinish": 0
      };

      let objective_string_list: string[] = [];

      element["Objective_List"].forEach((sub_element: any)=>{

        if(sub_element["Is_Finished"]){
          count_data["Count_Finish"] += 1;
        } else {
          count_data["Count_Unfinish"] += 1;
        }

        objective_string_list.push(sub_element["Objective_Name"]);
        
      })
      
      return {
        ...element,
        "String_Created_Date": moment.unix(element["Action_Time"]).format("DD MMMM YYYY"),
        "String_Day": moment.unix(element["Action_Time"]).format("dddd"),
        "Sumary_String": objective_string_list.join(", "),
        "Last_Update_String": moment.unix(element["Updated_Time"]).format("DD MMMM YYYY"),
        "Counter_Data": count_data
      };

    });

    return rev_todo_list;

  }

  searchToDoList(){

    this.search_btn_loading_state = true;

    let is_error: boolean = false;
    let valid_title: string | null = this.search_title == "" ? null : this.search_title;
    let valid_start_date: number | null = null;
    let valid_end_date: number | null = null;


    if(this.search_date_start != "" && this.search_date_start != null){

      let date_validate = moment(this.search_date_start, 'DD-MM-YYYY', true).isValid();
      if(!date_validate){
        this.search_date_start_error = "Please input a valid DD-MM-YYYY date";
        is_error = true;
      } else {
        valid_start_date = moment(this.search_date_start, 'DD-MM-YYYY', true).unix();
        this.search_date_start_error = "";
      }

    } else {
      this.search_date_start_error = "";
    }


    if(this.search_date_end != "" && this.search_date_end != null){

      let date_validate = moment(this.search_date_end, 'DD-MM-YYYY', true).isValid();
      if(!date_validate){
        this.search_date_end_error = "Please input a valid DD-MM-YYYY date";
        is_error = true;
      } else {
        valid_end_date = moment(this.search_date_end, 'DD-MM-YYYY', true).unix();
        this.search_date_end_error = "";
      }

    } else {
      this.search_date_end_error = "";
    }



    if(is_error){
      this.search_btn_loading_state = false;
      return;
    } else {
      this.search_loading_state = true;

      this.page = 1;

      this.loadToDoList(
        valid_title,
        valid_start_date,
        valid_end_date,
        1,
        this.data_per_page
      ).subscribe(([success, result])=>{
        console.log(success);
        console.log(result);
        let pagination_data = result["Pagination_Data"];
        this.total_data = pagination_data["Total_All_Data"];
        this.data_per_page = pagination_data["Max_Data_Per_Page"];

        // if (this.total_data == 0){
        //   this.total_data = this.data_per_page;
        // }

        this.last_search_title = valid_title;
        this.last_search_date_start = valid_start_date;
        this.last_search_date_end = valid_end_date;

        let data = result["List_Data"];
        this.todo_data_list = this.formatToDoList(data);
    
        this.search_loading_state = false;
      });

      

    }

    this.search_btn_loading_state = false;

  }

  sideNavHandler(state: boolean){

    if(state == true){
      this.show_sidenav = true;
    } else {
      this.show_sidenav = false;
    }
    

  }

  pageHandler(page_number: number){

    
    this.search_loading_state = true;

    this.loadToDoList(
      this.last_search_title,
      this.last_search_date_start,
      this.last_search_date_end,
      page_number,
      this.data_per_page
    ).subscribe(([success, result])=>{
      console.log(success);
      console.log(result);
      let pagination_data = result["Pagination_Data"];
      this.total_data = pagination_data["Total_All_Data"];
      this.data_per_page = pagination_data["Max_Data_Per_Page"];

      // if (this.total_data == 0){
      //   this.total_data = this.data_per_page;
      // }

      let data = result["List_Data"];
      this.todo_data_list = this.formatToDoList(data);

      
      this.search_loading_state = false;
    });

  }

  selectDataPerPageHandler(data_per_page: number){

    this.search_loading_state = true;

    this.loadToDoList(
      this.last_search_title,
      this.last_search_date_start,
      this.last_search_date_end,
      1,
      data_per_page
    ).subscribe(([success, result])=>{
      console.log(success);
      console.log(result);
      let pagination_data = result["Pagination_Data"];
      this.total_data = pagination_data["Total_All_Data"];
      this.data_per_page = pagination_data["Max_Data_Per_Page"];

      // if (this.total_data == 0){
      //   this.total_data = this.data_per_page;
      // }

      let data = result["List_Data"];
      this.todo_data_list = this.formatToDoList(data);

      
      this.search_loading_state = false;
    });

  }

}
