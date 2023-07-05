import { filter } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from './../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit{

  displayedColumns: string[] = ['name','edit'];
  dataSource:any;
  responseMessage:any;

  constructor(
    private categoryService:CategoryService,
    private ngsService:NgxUiLoaderService,
    private dailog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.ngsService.start();
    this.tableData();
  }

  tableData() {
    this.categoryService.getCategory().subscribe((response:any)=> {
      this.ngsService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any) => {
      this.ngsService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event:any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {

  }

  handleEditAction(data:any){

  }
}
