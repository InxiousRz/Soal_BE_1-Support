import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as moment from 'moment-timezone';
import { ApiGatewayService } from './api-gateway.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  project_config: any;
  mainlink: string = "";

  constructor(private http: HttpClient, private apiGateway: ApiGatewayService) { 

  }

  loadConfig(){

    return this.http.get('assets/project_config.json');

  }

  setConfig(config: any, main_url: string){
    this.project_config = config;
    this.mainlink = main_url;
  }



  loadTask(title: string | null, start_date: number | null, end_date: number | null, is_finished: boolean | null = null, page: number = 1, limit: number = 1000000) {

    let base_url = `${this.mainlink}/task/get`;

    // PARAMS
    // =====================================================================
    let query_param = new HttpParams();

    // START DATE
    if(title != null && title != ""){
      query_param = query_param.set("Title", title.toString());
    }

    // START DATE
    if(start_date != null){
      query_param = query_param.set("Action_Time_Start", start_date.toString());
    }

    // END DATE
    if(end_date != null){
      query_param = query_param.set("Action_Time_End", end_date.toString());
    }

    // START DATE
    if(is_finished != null){
      query_param = query_param.set("Is_Finished", is_finished.toString());
    }

    // START DATE
    query_param = query_param.set("Page", page.toString());

    // START DATE
    query_param = query_param.set("Limit", limit.toString());

    console.log(query_param.toString());

    // HEADER
    // =====================================================================
    let header = new HttpHeaders({
      "Content-Type": "application/json"
    });

    console.log(base_url + "?" + query_param.toString())

    let result = this.http.get(
      base_url,
      {
        params: query_param,
        headers: header,
        observe: 'response'
      }
    );

    let api_data = {
      "Path": base_url + "?" + query_param.toString(),
      "Type": "GET"
    }

    return this.apiGateway.translateResult(
      result,
      api_data
    );
  }

  loadTaskByID(task_id: number) {

    let base_url = `${this.mainlink}/task/get`;

    // HEADER
    // =====================================================================
    let header = new HttpHeaders({
      "Content-Type": "application/json"
    });

    console.log(base_url + "/" + task_id.toString())

    let result = this.http.get(
      base_url + "/" + task_id.toString(),
      {
        headers: header,
        observe: 'response'
      }
    );

    let api_data = {
      "Path": base_url + "/" + task_id.toString(),
      "Type": "GET"
    }

    return this.apiGateway.translateResult(
      result,
      api_data
    );

  }

  saveTask(title: string, action_time: number, objective_list: any){
    
    let base_url = `${this.mainlink}/task/add`;

    // HEADER
    // =====================================================================
    let header = new HttpHeaders({
      "Content-Type": "application/json"
    });

    let body = {
      "Title": title,
      "Action_Time": action_time,
      "Objective_List": objective_list
    };

    let result = this.http.post(
      base_url,
      body,
      {
        headers: header,
        observe: 'response'
      }
    );

    let api_data = {
      "Path": base_url,
      "Type": "POST"
    }

    return this.apiGateway.translateResult(
      result,
      api_data
    );

  }

  updateTask(task_id: number, title: string, objective_list: any){
    
    let base_url = `${this.mainlink}/task/update`;

    // HEADER
    // =====================================================================
    let header = new HttpHeaders({
      "Content-Type": "application/json"
    });

    let body = {
      "Title": title,
      "Objective_List": objective_list
    };

    let result = this.http.put(
      base_url + "/" + task_id.toString(),
      body,
      {
        headers: header,
        observe: 'response'
      }
    );

    let api_data = {
      "Path": base_url + "/" + task_id.toString(),
      "Type": "PUT"
    }

    return this.apiGateway.translateResult(
      result,
      api_data
    );

  }

  deleteTask(task_id: number) {

    let base_url = `${this.mainlink}/task/delete`;

    // HEADER
    // =====================================================================
    let header = new HttpHeaders({
      "Content-Type": "application/json"
    });

    console.log(base_url + "/" + task_id.toString())

    let result = this.http.delete(
      base_url + "/" + task_id.toString(),
      {
        headers: header,
        observe: 'response'
      }
    );

    let api_data = {
      "Path": base_url + "/" + task_id.toString(),
      "Type": "DELETE"
    }

    return this.apiGateway.translateResult(
      result,
      api_data
    );

  }

}
