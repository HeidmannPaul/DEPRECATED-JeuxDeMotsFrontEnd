import { Component, OnInit } from '@angular/core';
import { ServiceRequestService } from "../ServiceRequest/service-request.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  value: any = null;
  response: any = null;
  defs: any[] = [];


  public constructor(private getData: ServiceRequestService) { }

  ngOnInit() {

  }

  request() {
    if (this.value != null) {
      let response = this.getData.getValue(this.value).subscribe(res => {

        let incr = 1;
        this.defs=[];
        this.response = res._body;

        let def: any[] = this.response.split("</def>");
        let def2: any[] = def[0].split("<def>");
        this.response = def2[1];
        let defWithoutBr: any[] = this.response.split("<br>");
        let i=0;
        let car = null;
        while(car==null)
        {
        if(defWithoutBr[i].length!=0)
        {
          car= defWithoutBr[i].trim().substring(0, 2);
        }
        }


        if(defWithoutBr[0].trim().substring(0, 2))

        defWithoutBr.forEach(element => {
          if (element.trim().length != 0) {
            if (element.trim().substring(0, incr.toString().length + 1) == incr.toString() + ".") {
              this.defs.push(element);
              incr++;
              console.log("'j' ajoute un élément ", element);
            }
            else {
              this.defs[this.defs.length - 1] += element;
              console.log("'je concatene", element);
 
            }
          }

        })

        console.log("defs", this.defs);





        console.log("res", this.response)
      });
    }
  }
}
