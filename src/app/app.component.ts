import { Component, OnInit } from '@angular/core';
import { ServiceRequestService } from "../ServiceRequest/service-request.service";
import { Router } from "@angular/router";
import { AutoCompleteModule, DataTableModule, SharedModule, DialogModule, SelectItem } from 'primeng/primeng';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  value: any = null;
  formerValueLength: any = null;
  response: any = null;
  defs: any[] = [];
  isEnumerated: boolean = true;
  suggestions: any[] = [];

  //allRelations: any = null;
  relations: any[] = [];

  //contiendra les colonnes pour le tableau
  cols: any[] = [];
  rows: any[] = [];
  legend: String = "";

  //permettra d'afficher la fenetre de dialogue en le mettant a true 
  display: boolean = false;

  allEntities: any[] = [];
  allRelationsTypes: any[] = [];
  allLeavingRelations: any[] = [];
  allIncomingRelations: any = [] = [];

  options: SelectItem[];
  dropdownValue: any = "entities";



  public constructor(private getData: ServiceRequestService) { }

  ngOnInit() {


    this.cols =
      [
        { field: 'eid', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'type', header: 'Type' },
        { field: 'weight', header: 'Weight' },
        { field: 'formatedName', header: 'Nom formaté' }
      ]

    this.legend = "les types de noeuds (Nodes Types) : nt;ntid;'ntname'    nt;1;'n_term'    nt;2;'n_form'    nt;4;'n_pos'    nt;6;'n_flpot'    nt;8;'n_chunk'    nt;9;'n_question'    nt;10;'n_relation'    nt;12;'n_analogy'    nt;18;'n_data'    nt;36;'n_data_pot'    nt;444;'n_link'    nt;666;'n_AKI'    nt;777;'n_wikipedia'"

    this.options = [
      { label: "Entitées", value: "entities" },
      { label: "Types de relations", value: "relationType" },
      { label: "Relations entrantes", value: "incomingRelations" },
      { label: "Relations sortantes", value: "leavingRelations" }
    ]


  }

  request() {
    if (this.value.word) {
      this.value = this.value.word;
    }
    if (this.value) {
      /*
      this.value de la forme : {_id: "5a5100e4ea180a6f10082d6d", word: "caillou", coeff: 6.45}
      */

      this.getData.getValue(this.value).subscribe(res => {
        this.response = res._body;
        console.log("this.value dessus", this.value)
        //this.cookieService.set(this.value, res._body);

        this.orderDefsEntitiesRelations();
        this.value="";
      }, err => {
        console.log("err", err)
      });
      //("res", res)

      // }
    }
  }

  autoCompletionQuery(event) {

    /*if(this.value.length==1 && this.formerValueLength==0)
    {
      this.suggestions=[];
    }*/
    this.formerValueLength = this.value.length
    let values = this.getData.getAutoComplete(this.value).subscribe(res => {
      /*
      [...res] créé une nouvelle référence, sans ca, ca ne fonctionne pas avec le code commenté ci dessous
      voir spread functions sur internet 
      */
      this.suggestions = [...res];
      let i = 0;
      /* res.forEach(element => {
         this.suggestions[i] = element.word;
         i++;
       });*/


    })
  }

  //tous les if car il peut manquer certains éléments dans les réponses, comme pour le mot main
  orderRelations(allRelations) {

    //déclenché quand on fait une nouvelle recherche, on réinitialise donc le tableau
    this.rows = [];

    let firstPart: any[] = null;
    let entities: any[] = null;
    let relationsTypes: any[] = null;
    let leavingRelations: any[] = null;
    let incomingRelations: any[] = null;

    firstPart = allRelations.split("// les types de relations (Relation Types) : rt;rtid;'trname';'trgpname';'rthelp'");
    if (firstPart) {
      if (firstPart[0]) {
        entities = firstPart[0].split("// les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name'");
      } if (firstPart[1]) {
        relationsTypes = firstPart[1].split("// les relations sortantes : r;rid;node1;node2;type;w");
      }
    }
    if (relationsTypes) {
      if (relationsTypes[0]) {
        this.allRelationsTypes = relationsTypes[0].split("\n");
      } if (relationsTypes[1]) {

        leavingRelations = relationsTypes[1].split("// les relations entrantes : r;rid;node1;node2;type;w");
      }
    } if (leavingRelations) {
      if (leavingRelations[0]) {
        this.allLeavingRelations = leavingRelations[0].split("\n");
        console.log("leavingRelations", leavingRelations)
      }
      if (leavingRelations[1]) {

        incomingRelations = leavingRelations[1].split("// END");
      }
    }
    if (incomingRelations) {
      if (incomingRelations[0]) {
        this.allIncomingRelations = incomingRelations[0].split("\n");
      }
    }
    if (entities) {
      if (entities[1]) {
        this.allEntities = entities[1].split("\n");
      }
      /*console.log("valeur firstPart", firstPart)
      console.log("valeur this.allrelationsTypes", this.allRelationsTypes)
      console.log("valeur allleavingRelations", this.allLeavingRelations)
      console.log("valeur allIncomingRelations", this.allIncomingRelations)
      console.log("valeur entities", entities)
      console.log("valeur allEntities", this.allEntities)*/
    }
    this.displaySelection();


  }

  displayDialogEntity() {
    this.display = true;
  }

  displaySelection() {
    //comme on change de sélection, on réinitialise
    this.rows = [];
    if (this.dropdownValue == "entities") {

      this.cols =
        [
          { field: 'ID', header: 'ID' },
          { field: 'name', header: 'Name' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' },
          { field: 'formatedName', header: 'Nom formaté' }
        ]

      this.allEntities.forEach(element => {

        let tab: any[] = element.split(";");
        //j'ai vérifié que la longueur des entités était bien 5 ou 6
        /* if(cpt[tab.length])
         cpt[tab.length]++;
         else cpt[tab.length]=1;*/
        if (tab.length == 5) {
          this.rows.push({
            ID: tab[1],
            name: tab[2],
            type: tab[3],
            weight: tab[4],
            formatedName: "X"

          })
        }
        else if (tab.length == 6) {
          this.rows.push({


            ID: tab[1],
            name: tab[2],
            type: tab[3],
            weight: tab[4],
            formatedName: tab[5]
          })
        }


      })
      this.rows = [...this.rows]
      this.legend = "Légende : les types de noeuds (Nodes Types) : nt;ntid;'ntname' nt;1;'n_term' nt;2;'n_form' nt;4;'n_pos' nt;6;'n_flpot' nt;8;'n_chunk' nt;9;'n_question' nt;10;'n_relation' nt;12;'n_analogy' nt;18;'n_data' nt;36;'n_data_pot' nt;444;'n_link' nt;666;'n_AKI' nt;777;'n_wikipedia'";
    }
    else if (this.dropdownValue == "relationType") {

      this.cols =
        [
          { field: 'ID', header: 'ID' },
          { field: 'rtname', header: 'Name' },
          { field: 'trgpname', header: 'TRGPNAME' },
          { field: 'rthelp', header: 'Help' }
        ]

      this.allRelationsTypes.forEach(element => {

        let tab: any[] = element.split(";");
        //si tab.length > 5 alors il y a un ";" dans la partie "Help" des relations, on doit donc rassembler
        if (tab.length > 5) {
          for (let i = 5; i < tab.length; i++) {
            tab[4] += ";" + tab[i];
          }
        }

        if (tab.length > 4) {
          this.rows.push({
            ID: tab[1],
            rtname: tab[2],
            trgpname: tab[3],
            rthelp: tab[4]
          })
        }

      });
      this.rows = [...this.rows]
      this.legend = "";

    }
    else if (this.dropdownValue == "incomingRelations") {
      this.cols =
        [
          { field: 'ID', header: 'ID' },
          { field: 'node1', header: 'Node 1' },
          { field: 'node2', header: 'Node 2' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' }
        ]

      this.allIncomingRelations.forEach(element => {

        let tab: any[] = element.split(";");


        if (tab.length == 6) {
          this.rows.push({
            ID: tab[1],
            node1: tab[2],
            node2: tab[3],
            type: tab[4],
            weight: tab[5]
          })
        }

      });
      this.rows = [...this.rows]
      this.legend = "";
    }
    else if (this.dropdownValue == "leavingRelations") {
      this.cols =
        [
          { field: 'ID', header: 'ID' },
          { field: 'node1', header: 'Node 1' },
          { field: 'node2', header: 'Node 2' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' }
        ]
      //let size: any[] = [];

      this.allLeavingRelations.forEach(element => {

        let tab: any[] = element.split(";");

        if (tab.length == 6) {
          this.rows.push({
            ID: tab[1],
            node1: tab[2],
            node2: tab[3],
            type: tab[4],
            weight: tab[5]
          })
        }

      });
      this.rows = [...this.rows]
      this.legend = "";
    }

  }

  mysort(event) {
    //par défaut le sort de p-datatable utilise l'ordre alphanumérique sur les chiffres, donc 9>80, il faut donc changer le tri
    if (event.field == "ID" || event.field == "type" || event.field == "weight" || event.field == "node1" || event.field == "node2") {

      let intComparison = function (val1, val2) {
        let int1 = parseInt(val1[event.field]);
        let int2 = parseInt(val2[event.field]);

        if (event.order == 1) {
          if (int1 > int2) return -1; else return 1;
        }
        else {
          if (int1 > int2) return 1; else return -1;
        }
      }

      this.rows.sort(intComparison);
      this.rows = [...this.rows]
      /*this.rows.forEach(element =>
      {
        console.log("valeur dans element ", element[event.field]);
   
      })*/


    }
    else {
      let stringComparison = function (val1, val2) {

        /*
        localeCompare permet de faire une comparaison en prenant en compte les accents.
        Si on fait juste un val1>val2, alors "é" est avant a. Avec localeCompare
        il est entre "d" et "e"
        */
        if (event.order == 1) {
          if (val1[event.field].toLowerCase().localeCompare(val2[event.field].toLowerCase(), "fr") > 0) return -1; else return 1;
        }
        else {
          if (val1[event.field].toLowerCase().localeCompare(val2[event.field].toLowerCase(), "fr") > 0) return 1; else return -1;
        }
      }
      this.rows.sort(stringComparison);
      this.rows = [...this.rows]
    }
  }

  orderDefsEntitiesRelations() {

    //console.log("valeur this.value", this.value)
    // console.log("this.response", this.response)
    if (this.response) {
      //this.cookieService.set(this.value,res._body);
      let incr = 1;
      this.defs = [];
      // this.response = res._body;
      let def: any[] = this.response.split("</def>");
      //s'il y a des balises def
      if (def.length > 1) {





        //s'il y a une balise <def> alors le mot est connu en base de données, meme si le contenu de cette balise est vide
        let allRelations: any = def[1];
        this.orderRelations(allRelations);



        let def2: any[] = def[0].split("<def>");
        this.response = def2[1];
        let defWithoutBr: any[] = this.response.split("<br>");


        //s'il y a bien une définition dans les balises def
        if (defWithoutBr.length > 1) {
          defWithoutBr = defWithoutBr.filter(element => {
            return element.trim().length > 0;
          });

          let car = defWithoutBr[0].trim().substring(0, 2);


          if (car == "1.") {
            //if (defWithoutBr[0].trim().substring(0, 2))

            defWithoutBr.forEach(element => {
              if (element.trim().substring(0, incr.toString().length + 1) == incr.toString() + ".") {
                this.defs.push(element);
                incr++;
                //("'j' ajoute un élément ", element);
              }
              else {
                this.defs[this.defs.length - 1] += element;
                //console.log("'je concatene", element);

              }


            })
          }
          else {
            this.isEnumerated = false;
            this.defs = defWithoutBr;
          }
        }
        else {
          this.defs = [];
          this.defs.push("Pas de définition pour ce mot...")
        }

      }
      else {
        this.defs = [];
        this.defs.push("Aucune donnée...")
        this.rows = [];
        this.allEntities = [];
        this.allRelationsTypes = [];
        this.allLeavingRelations = [];
        this.allIncomingRelations = [];
        // this.relations="Aucune relation..."

        /*this.relations=def[0];*/
      }
    }
    //condition if res!=null
    else {
      this.defs = [];
      this.defs.push("Aucune donnée...")
      this.rows = [];
      this.allEntities = [];
      this.allRelationsTypes = [];
      this.allLeavingRelations = [];
      this.allIncomingRelations = [];
      // this.relations="Aucune relation..."
    }
  }



  findEntityByRelationId() {

  }

}


