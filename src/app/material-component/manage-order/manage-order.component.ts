import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit{

  displayedColumns: string[] = ['name','category','quantity','total','edit'];
  dataSource:any = [];
  manageOrderFrom:any = FormGroup;
  categorys:any = [];
  products:any = [];
  price:any;
  totalAmount:number = 0;
  responseMessage:any;

  constructor(
    private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    private productService:ProductService,
    private snackbarService:SnackbarService,
    private billService:BillService,
    private ngxService:NgxUiLoaderService
  ){}

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderFrom = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod:[null,[Validators.required]],
      product:[null,[Validators.required]],
      category:[null,[Validators.required]],
      price:[null,[Validators.required]],
      total:[0,[Validators.required]],
      quantity: [1,[Validators.required]],
    });
  }

  getCategorys() {
   this.categoryService.getFilterCategorys().subscribe((response) => {
    this.ngxService.stop();
    this.categorys = response;
   }, (error:any) => {
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
   }) 
  }

  getProductsByCategory(values:any) {
    this.productService.getProductsByCategory(values.id).subscribe((response) => {
      this.products = response;
      this.manageOrderFrom.controls['price'].setValue('');
      this.manageOrderFrom.controls['quantity'].setValue('');
      this.manageOrderFrom.controls['total'].setValue(0);
    },(error:any) => {
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  getProductDetails(values:any){
    this.productService.getById(values.id).subscribe((response:any) => {
      this.price = response.price;
      this.manageOrderFrom.controls['price'].setValue(response.price);
      this.manageOrderFrom.controls['quantity'].setValue('1');
      this.manageOrderFrom.controls['total'].setValue(this.price * 1);
    },(error:any) => {
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  setQuantity(value:any){
    var temp = this.manageOrderFrom.controls['quantity'].value;
    if(temp > 0){
      this.manageOrderFrom.controls['total'].setValue(
        this.manageOrderFrom.controls['quantity'].value
        * this.manageOrderFrom.controls['price'].value);
    }
    else if(temp != ''){
      this.manageOrderFrom.controls['quantity'].setValue('1');
      this.manageOrderFrom.controls['total'].setValue(
        this.manageOrderFrom.controls['quantity'].value
        * this.manageOrderFrom.controls['price'].value);

    }
  }

  validateProductAdd() {
    if(this.manageOrderFrom.controls['total'].value === 0 || 
      this.manageOrderFrom.controls['total'].value === null ||
      this.manageOrderFrom.controls['quantity'].value <= 0
    ){
      return true;
    }
    else{
      return false;
    }
  }

  validateSubmit() {
    if(this.totalAmount === 0 || 
      this.manageOrderFrom.controls['name'].value === null ||
      this.manageOrderFrom.controls['email'].value === null ||
      this.manageOrderFrom.controls['contactNumber'].value === null ||
      this.manageOrderFrom.controls['paymentMethod'].value === null
      ){
        return true;
      }
      else{
        return false;
      }
  }

  add(){
    var formData = this.manageOrderFrom.value;
    var productName = this.dataSource.find((e:{id:number}) => e.id === formData.product.id);
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id:formData.product.id, 
        name:formData.product.name,
        category:formData.product.category, 
        quantity:formData.product.quantity, 
        price:formData.product.price,
        total:formData.product.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded,"success");
    }
    else{
      this.snackbarService.openSnackBar(GlobalConstants.productExistError,GlobalConstants.error);
    }
  }

  handleDeleteAction(value:any, element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    var formData = this.manageOrderFrom.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    }
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any) => {
      this.downloadFile(response?.uuid);
      this.manageOrderFrom.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    },(error:any) => {
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  downloadFile(fileName:string){
    var data = {
      uuid: fileName
    }
    this.billService.getPdf(data).subscribe((response) => {
      saveAs(response,fileName+'.pdf');
      this.ngxService.stop();
    })
  }
}
