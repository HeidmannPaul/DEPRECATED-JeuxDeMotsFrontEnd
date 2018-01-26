import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class ServiceRequestService {

  constructor(private http: Http) { }

  getValue(param: any): Observable<any> {
    let url = "http://localhost:8888/" + param;
    var headers = new Headers();
    let observable = this.http.get(url);//.map((res:Response)=> res.toString());
    return observable;
  }

  getValueByIdRelations(paramValue: any,paramRel:any): Observable<any> {
    let url = "http://localhost:8888/"+ paramValue+"/Rel/"+paramRel;
    console.log()
    var headers = new Headers();
    let observable = this.http.get(url);//.map((res:Response)=> res.toString());
    return observable;
  }
  getAutoComplete(param: any): Observable<any> {
    let url = "http://localhost:8888/Word/" + param;
    var headers = new Headers();
    let observable = this.http.get(url).map((res:Response)=> res.json());
    return observable;
  }
  getValueByIdRelations(paramValue: any,paramRel:any): Observable<any> {
    let url = "http://localhost:8888/id/" + paramValue+"/Rel/"+paramRel;
    var headers = new Headers();
    let observable = this.http.get(url);//.map((res:Response)=> res.toString());
    return observable;
  }

  getRelationComplete(param: any): Observable<any> {
    let url = "http://localhost:8888/Rel/" + param;
    var headers = new Headers();
    let observable = this.http.get(url).map((res:Response)=> res.json());
    return observable;
  }

  getRelationComplete(param: any): Observable<any> {
   
    let url = "http://localhost:8888/Rel/" + param;
    var headers = new Headers();
    let observable = this.http.get(url).map((res:Response)=> res.json());
    return observable;
  }
}
