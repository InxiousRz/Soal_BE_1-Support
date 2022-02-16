import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input('dangerous_warn') dangerous_warn: string = "";
  @Input('warn') warn: string = "";
  @Input('warn_target') warn_target: string = "";
  @Input('type') type: string = "";

  modal: NgbActiveModal;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) { 
    this.modal = activeModal;
  }

  ngOnInit(): void {
  }

}
