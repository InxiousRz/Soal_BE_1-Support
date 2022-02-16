
import { Component, OnInit, Injectable, ViewChild, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl,  Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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
    (date.month.toString().length == 1 ? "0"+ date.month.toString() : date.month) + 
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
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class TaskFormComponent implements OnInit {

  @Input('form_type') form_type: string | null = null;
  @Input('task_data') task_data: any = null;

  objective_list: any[] = [];
  task_date_for: string = moment().format('DD-MM-YYYY');
  modal_title: string = "";
  task_title: string = "";

  save_loading_state: boolean = false;
  update_loading_state: boolean = false;

  task_title_error_text: string = "";
  task_date_error_text: string = "";
  task_objective_error_text: string = "";

  widget_state_map: any;
  objective_updated_text: string = "";
  objective_added_text: string = "";

  // BINDED ELEMENT CLASS
  cls_add_objective_form: any;
  cls_add_objective_btn_set: any;

  modal: NgbActiveModal;

  constructor(
    public activeModal: NgbActiveModal, 
    private modalService: NgbModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private apiService: ApiService
    ) { 
    this.modal = activeModal;
  }

  ngOnInit(): void {
    this.widget_state_map = {
      "Add_Objective": false,
      "Edit_Objective": false,
      "Edit_Objective_Index": null
    }


    // BINDED ELEMENT CLASS
    this.cls_add_objective_form = {
      "form-group": true,
      "hide": true
    }
    
    this.cls_add_objective_btn_set = {
      "form-row": true,
      "hide": true
    }


    if (this.form_type == "UPDATE"){
      this.modal_title = "Edit Task";
      this.task_title = this.task_data["Title"];
      this.objective_list = this.task_data["Objective_List"];
    }

    if (this.form_type == "ADD"){
      this.modal_title = "Add New Task";
    }
  }

  setToday() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  viewAddObjective(){
    this.widget_state_map.Add_Objective = true;
    this.cls_add_objective_form.hide = false;
    this.cls_add_objective_btn_set.hide = false
    this.hideEditObjective();
  }

  hideAddObjective(){
    this.widget_state_map.Add_Objective = false;
    this.cls_add_objective_form.hide = true;
    this.cls_add_objective_btn_set.hide = true;
    this.objective_added_text = "";
  }

  saveAddObjective(){

    if(this.objective_added_text == ""){
      return;
    }

    if (this.form_type == "UPDATE"){
      this.objective_list.push(
        {
          "Objective_Name": this.objective_added_text,
          "Is_Finished": false,
        }
      );
    }

    if (this.form_type == "ADD"){
      this.objective_list.push(
          this.objective_added_text
      );
    }

    this.objective_added_text = "";

    this.hideAddObjective()
  }

  showEditObjective(index:number){
    this.widget_state_map.Edit_Objective_Index = index;

    if (this.form_type == "UPDATE"){
      this.objective_updated_text = this.objective_list[index]["Objective_Name"];
    }

    if (this.form_type == "ADD"){
      this.objective_updated_text = this.objective_list[index];
    }

    this.hideAddObjective();
  }

  hideEditObjective(){
    this.widget_state_map.Edit_Objective_Index = null;
  }

  deleteEditObjective(index:number){
    this.objective_list.splice(index, 1);
  }

  saveEditObjective(index:number){

    if(this.objective_updated_text == ""){
      return;
    }

    if (this.form_type == "UPDATE"){
      this.objective_list[index]["Objective_Name"] = this.objective_updated_text;
    }

    if (this.form_type == "ADD"){
      this.objective_list[index] = this.objective_updated_text;
    }

    
    this.objective_updated_text = "";

    this.hideEditObjective()

  }

  saveObjective(){

    
    if (this.form_type == "UPDATE"){
      this.update_loading_state = true;
    }

    if (this.form_type == "ADD"){
      this.save_loading_state = true;
    }
    
    let is_error: boolean = false;
    
    let taskform_gr = new FormGroup({
      title: new FormControl(this.task_title, [
        Validators.required,
        Validators.minLength(1)
      ]),
      objective_edit: new FormControl(this.objective_updated_text, [
        Validators.required,
        Validators.minLength(1)
      ]),
      objective_add: new FormControl(this.objective_added_text, [
        Validators.required,
        Validators.minLength(1)
      ]),
    });


    if(!taskform_gr.valid){

      let title_errors = taskform_gr.get('title')?.errors;
      if(title_errors != null){

        if(title_errors["minLength"] != undefined){
          // SHOW minlength
          this.task_title_error_text = "Title can't be empty";
          is_error = true;
        }

        if(title_errors["required"] != undefined){
          // SHOW required
          this.task_title_error_text = "Title can't be empty";
          is_error = true;
        }

      } else {
        this.task_title_error_text = "";
      }

      let date_validate = moment(this.task_date_for, 'DD-MM-YYYY', true).isValid();
      if(!date_validate){
        this.task_date_error_text = "Please input a valid DD-MM-YYYY date";
        is_error = true;
      } else {
        this.task_date_error_text = "";
      }

      if(this.objective_list.length == 0){
        // SHOW CANT EMPTY
        this.task_objective_error_text = "Task must have at least 1 Objective"
        is_error = true;
      } else {
        this.task_objective_error_text = "";
      }

    }



    if(is_error){
      this.save_loading_state = false;
      this.update_loading_state = false;
      return;
    } else {

      if (this.form_type == "UPDATE"){
        this.apiService.updateTask(
          this.task_data["Task_ID"],
          this.task_title,
          this.objective_list
        ).subscribe(([success, result])=>{
          console.log(success);
          console.log(result);
          this.update_loading_state = false;
    
          this.modal.close(true);
        });
      }
  
      if (this.form_type == "ADD"){
        this.apiService.saveTask(
          this.task_title,
          moment(this.task_date_for, "DD-MM-YYYY",  true).unix(),
          this.objective_list
        ).subscribe(([success, result])=>{
          console.log(success);
          console.log(result);
          this.save_loading_state = false;
    
          this.modal.close(true);
        });
      }

      

    }


  }

}
