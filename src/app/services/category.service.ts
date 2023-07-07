import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl;

  constructor(
    private httplClient:HttpClient
  ) { }

  add(data:any){
    return this.httplClient.post(
      this.url + "/category/add", data,{
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    )
  }

  update(data:any){
    return this.httplClient.post(
      this.url + "/category/update", data,{
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    )
  }

  getCategory() {
    return this.httplClient.get(this.url+"/category/get");
  }

  getFilterCategorys() {
    return this.httplClient.get(this.url+"/category/get?filterValue=true");
  }
  
}
