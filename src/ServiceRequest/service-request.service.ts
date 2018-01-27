import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class ServiceRequestService {

  constructor(private http: Http) { }

  getValue(param: any): Observable<any> {
    let url = "http://localhost:8888/" + param;
    //let url = "Words/" + param;

    var headers = new Headers();
    let observable = this.http.get(url);//.map((res:Response)=> res.toString());
    return observable;
  }

  getAutoComplete(param: any): Observable<any> {
    let url = "http://localhost:8888/Word/" + param;
    //let url = "Words/Word/" + param;
    var headers = new Headers();
    let observable = this.http.get(url).map((res:Response)=> res.json());
    return observable;
  }
  getValueByIdRelations(paramValue: any,paramRel:any): Observable<any> {
    let url = "http://localhost:8888/id/" + paramValue+"/Rel/"+paramRel;
   // let url = "Words/id/" + paramValue+"/Rel/"+paramRel;
    var headers = new Headers();
    let observable = this.http.get(url);//.map((res:Response)=> res.toString());
    return observable;
  }

  getRelationComplete(param: any): Observable<any> {
    let url = "http://localhost:8888/Rel/" + param;
    //let url = "Words/Rel/" + param;
    var headers = new Headers();
    let observable = this.http.get(url).map((res:Response)=> res.json());
    return observable;
  }

 
}
