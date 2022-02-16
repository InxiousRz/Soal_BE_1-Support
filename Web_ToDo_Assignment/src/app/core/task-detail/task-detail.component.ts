import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  
  @Input('task_id') task_id: number | null = null;

  modal: NgbActiveModal;
  task_data: any = {
    "Title": "",
    "Objective_List": []
  };
  is_completion: boolean = false;
  objective_summary: any = {
    "Objective_Finished": 0,
    "Objective_Total": 0
  };
  save_loading_state: boolean = false;
  edit_loading_state: boolean = false;
  delete_loading_state: boolean = false;
  is_already_completed: boolean = false;

  constructor(
    public activeModal: NgbActiveModal, 
    private modalService: NgbModal,
    private apiService: ApiService
  ) { 
    this.modal = activeModal;
  }

  ngOnInit(): void {
    
    if(this.task_id != null){
      this.loadData(this.task_id).subscribe(([success, result])=>{
        console.log(success);
        console.log(result);
        if(success){
          this.task_data = result;
          this.is_already_completed = result["Is_Finished"];
          this.getObjectiveSummary();
        }
      });
    }
    
  }

  getObjectiveSummary(){
    
    let objective_list = this.task_data["Objective_List"];
    let objective_count = objective_list.length;
    let objective_finished_count = 0;

    for(let objective of objective_list){
      if(objective["Is_Finished"] === true){
        objective_finished_count += 1;
      }
    }

    this.objective_summary = {
      "Objective_Total": objective_count,
      "Objective_Finished": objective_finished_count
    };
}

  loadData(task_id: number){

    return this.apiService.loadTaskByID(
      task_id
    );

  }

  saveData(task_id:number){

    this.save_loading_state = true;

    if (this.objective_summary["Objective_Finished"]== this.objective_summary["Objective_Total"]){
      this.openCompleteConfirmationDialogue()
      this.save_loading_state = false;
      return;

    }

    console.log("=====================")
    console.log(this.task_data)
    return this.apiService.updateTask(
      task_id,
      this.task_data["Title"],
      this.task_data["Objective_List"]
    ).subscribe(([success, result])=>{
      console.log(success);
      console.log(result);
      this.save_loading_state = false;

      this.modal.close(true);
    });

  }

  deleteData(task_id:number){

    this.delete_loading_state = true;

    return this.apiService.deleteTask(
      task_id
    ).subscribe(([success, result])=>{
      console.log(success);
      console.log(result);
      this.delete_loading_state = false;

      this.modal.close(true);
    });

  }

  setObjectiveFinished(objective_index: number){

    if(this.is_already_completed == true){
      return;
    }

    this.task_data["Objective_List"][objective_index]["Is_Finished"] = !this.task_data["Objective_List"][objective_index]["Is_Finished"]; 
    this.getObjectiveSummary();

  }

  openFormUpdate(){

    this.edit_loading_state = true;

    const modalRef = this.modalService.open(TaskFormComponent, { size: 'xl', scrollable: true, centered: true, backdrop: 'static' });
    modalRef.componentInstance.task_data = this.task_data;
    modalRef.componentInstance.form_type = "UPDATE";

    modalRef.closed.subscribe((data)=>{

      if(data === true){

        this.modal.close(true);
        
      }
      

    });

    this.edit_loading_state = false;
  }


  openDeleteConfirmationDialogue(){

    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', scrollable: true, centered: true, backdrop: 'static' });
    modalRef.componentInstance.type = "WARNING";
    modalRef.componentInstance.warn = "Delete Task ";
    modalRef.componentInstance.warn_target = this.task_data["Title"];
    modalRef.componentInstance.dangerous_warn = "";

    // modalRef.dismissed.subscribe((data)=>{
    //   console.log("=============== DISSMISS  ==");
    //   console.log(data);
    // });

    modalRef.closed.subscribe((data)=>{

      if(data === true){

        if(this.task_id){
          this.deleteData(this.task_id)
        }

      }
      

    });

    // modalRef.hidden.subscribe((data)=>{
    //   console.log("=============== HIDDEN  ==");
    //   console.log(data);
    // });
  }

  openCompleteConfirmationDialogue(){

    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', scrollable: true, centered: true, backdrop: 'static' });
    modalRef.componentInstance.type = "ACTION";
    modalRef.componentInstance.warn = "Complete Task ";
    modalRef.componentInstance.warn_target = this.task_data["Title"];
    modalRef.componentInstance.dangerous_warn = "This Task will be archived.";

    // modalRef.dismissed.subscribe((data)=>{
    //   console.log("=============== DISSMISS  ==");
    //   console.log(data);
    // });

    modalRef.closed.subscribe((data)=>{

      if(data === true){

        if(this.task_id){
          this.apiService.updateTask(
            this.task_id,
            this.task_data["Title"],
            this.task_data["Objective_List"]
          ).subscribe(([success, result])=>{
            console.log(success);
            console.log(result);
            this.save_loading_state = false;
      
            this.modal.close(true);
          });
        }

      }
      

    });

    // modalRef.hidden.subscribe((data)=>{
    //   console.log("=============== HIDDEN  ==");
    //   console.log(data);
    // });
  }

  getSaveButtonText(){
    if (this.objective_summary["Objective_Finished"]== this.objective_summary["Objective_Total"]){
      return "Complete";
    } else {
      return "Save";
    }
  }

}
