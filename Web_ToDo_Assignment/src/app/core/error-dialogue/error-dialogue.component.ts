import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-dialogue',
  templateUrl: './error-dialogue.component.html',
  styleUrls: ['./error-dialogue.component.css']
})
export class ErrorDialogueComponent implements OnInit {

  @Input('on') on: string = "";
  @Input('error') error: string = "";
  @Input('status_code') status_code: string = "";

  modal: NgbActiveModal;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) { 
    this.modal = activeModal;
  }

  ngOnInit(): void {
  }

}
