import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class ServiceRequestService {

  constructor(private http: Http) { }

  getValue(param: any): Observable<any> {
    let url = "http://81.14.18.68:8888/" + param;
    var headers = new Headers();
    let observable = this.http.get(url);//.map((res:Response)=> res.toString());
    return observable;
  }

  getAutoComplete(param: any): Observable<any> {
    let url = "http://81.14.16.68:8888/Word/" + param;
    var headers = new Headers();
    let observable = this.http.get(url).map((res:Response)=> res.json());
    return observable;
  }

}
