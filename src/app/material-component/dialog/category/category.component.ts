import { filter } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from './../../../services/category.service';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit{

 onAddCategory = new EventEmitter();

 onEditCategory = new EventEmitter();
 categoryForm:any = FormGroup;
 dialogAction:any = "Add";
 action:any = "Add";
 responseMessage:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    public dialogRef:MatDialogRef<CategoryComponent>,
    private snackbarService:SnackbarService,
  ){}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

 handleSubmit(){
  if(this.dialogAction === 'Edit'){
    this.edit();
  }
  else{
    this.add();
  }
 }

 add(){
  var formData = this.categoryForm.value;
  var data = {
    name: formData.name
  }
  this.categoryService.add(data).subscribe((response:any) => {
    this.dialogRef.close();
    this.onAddCategory.emit();
    this.responseMessage = response.message;
    this.snackbarService.openSnackBar(this.responseMessage, "success");
  }, (error:any) => {
    this.dialogRef.close();
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
 }

 edit(){
  var formData = this.categoryForm.value;
  var data = {
    id: this.dialogData.data.id,
    name: formData.name
  }
  this.categoryService.update(data).subscribe((response:any) => {
    this.dialogRef.close();
    this.onAddCategory.emit();
    this.responseMessage = response.message;
    this.snackbarService.openSnackBar(this.responseMessage, "success");
  }, (error:any) => {
    this.dialogRef.close();
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
 }

}
