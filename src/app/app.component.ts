import { Component, OnInit } from '@angular/core';
import { ServiceRequestService } from "../ServiceRequest/service-request.service";
import { Router } from "@angular/router";
import { AutoCompleteModule, DataTableModule, SharedModule, DialogModule, SelectItem, DataTable } from 'primeng/primeng';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  value: any = null;
  relation: any[] = null;
  formerValueLength: any = null;
  formerRelLength: any = null;
  response: any = null;
  defs: any[] = [];
  isEnumerated: boolean = true;
  suggestions: any[] = [];
  suggestionsRel: any[] = [];

  //allRelations: any = null;
  relations: any[] = [];

  //contiendra les colonnes pour le tableau
  cols: any[] = [];
  //contiendra les colonnes pour le tableau dans p-datatable
  colsDialog: any[] = [];

  rows: any[] = [];
  rowsDialog: any[] = []
  legend: String = "";
  legendCopy: String = "";
  legendDialog: String = "";
  legendCopyDialog: String = "";

  //permettra d'afficher la fenetre de dialogue en le mettant à true 
  display: boolean = false;

  allEntities: any[] = [];
  allRelationsTypes: any[] = [];
  allLeavingRelations: any[] = [];
  allIncomingRelations: any = [] = [];

  allEntitiesForDialog: any[] = [];
  allRelationsTypesForDialog: any[] = [];
  allLeavingRelationsForDialog: any[] = [];
  allIncomingRelationsForDialog: any = [] = [];


  options: SelectItem[];
  optionsDialog: SelectItem[];

  dropdownValue: any = "entities";
  dropdownValueDialog: any = "entities";

  //contiendra le mot relatif à la ligne sélectionnée
  wordSelected: any = null;

  //pour les filtres
  relationTypes: SelectItem[];
  entitiesTypes: SelectItem[];

  //utilisé pour retrouver directement la valeur associée au numéro du type de la relation
  keyValueRelationTypes: any[] = [];

  //quand on filtre par type de relation, rowsCopy permet de garder l'état initial des réponses
  rowsCopy: any[] = [];

  //clé valeur contenant la valeur de l'entity associée à l'ID, donc soit un mot soit une 
  //référence à une relation
  keyValueEntityId: any[] = [];
  keyValueEntityIdForDialog: any[] = [];

  isRelationReference: boolean = false;


  public constructor(private getData: ServiceRequestService) { }

  ngOnInit() {


    this.cols =
      [
        // { field: 'eid', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'type', header: 'Type' },
        { field: 'weight', header: 'Weight' },
        // { field: 'formatedName', header: 'Nom formaté' }
      ]

    this.colsDialog =
      [
        // { field: 'eid', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'type', header: 'Type' },
        { field: 'weight', header: 'Weight' },
        // { field: 'formatedName', header: 'Nom formaté' }
      ]

    //this.legend = "les types de noeuds (Nodes Types) : nt;ntid;'ntname'    nt;1;'n_term'    nt;2;'n_form'    nt;4;'n_pos'    nt;6;'n_flpot'    nt;8;'n_chunk'    nt;9;'n_question'    nt;10;'n_relation'    nt;12;'n_analogy'    nt;18;'n_data'    nt;36;'n_data_pot'    nt;444;'n_link'    nt;666;'n_AKI'    nt;777;'n_wikipedia'"

    this.options = [
      { label: "Entitées", value: "entities" },
      { label: "Types de relations", value: "relationType" },
      { label: "Relations entrantes", value: "incomingRelations" },
      { label: "Relations sortantes", value: "leavingRelations" }
    ]

    this.optionsDialog = [
      { label: "Entitées", value: "entities" },
      { label: "Types de relations", value: "relationType" },
      { label: "Relations entrantes", value: "incomingRelations" },
      { label: "Relations sortantes", value: "leavingRelations" }
    ]

  }

  /*on met un paramètre optionnel, et s'il est défini c'est que la méthode a été
  appelée par le bouton affiché quand un clique sur une ligne de type Entité
*/
  request(wordSelected?: any) {
    if (this.value.word) {
      this.value = this.value.word.toLowerCase();
    }
    else if (wordSelected) {
      this.value = wordSelected.toLowerCase();
      this.display = false;
    }
    
    if (this.value) {
      /*
      this.value de la forme : {_id: "5a5100e4ea180a6f10082d6d", word: "caillou", coeff: 6.45}
      */
      console.log("this.relation.length",this.relation)
      if(this.relation==null){
      this.getData.getValue(this.value).subscribe(res => {
        this.response = res._body;
        //this.cookieService.set(this.value, res._body);


        this.orderDefsEntitiesRelations();
        this.value = "";
      }, err => {
        console.log("err", err)
      });
      //("res", res)

      // }
    }else{
      let stringRel="";
      this.relation.forEach(element => {
        stringRel+=element.rel_id+",";
      });
      stringRel=stringRel.substr(0,stringRel.length-1);
      
      this.getData.getValueByIdRelations(this.value,stringRel).subscribe(res => {
      //console.log("réponse recue",res);
      this.response = res._body;
      // console.log("this.value dessus", this.value)
      //this.cookieService.set(this.value, res._body);

      this.orderDefsEntitiesRelations();
      this.value = "";
      this.relation=[];
    }, err => {
      console.log("err", err)
    });
    }
   }
  }


  /**
   * utilisé pour faire la requete quand on clique sur une relation dont le noeud 
   * réfère à une entité dont le nom est une relation
   */
  requestForRelationReference(wordSelected: any) {


    this.getData.getValue(wordSelected).subscribe(res => {
      // this.response = res._body;
      //this.cookieService.set(this.value, res._body);

      let allRelations = res._body.split("</def>")[1];

      this.orderRelationsForDialog(allRelations);
      // this.orderDefsEntitiesRelationsForRelationReference();
    }, err => {
      console.log("err", err)
    });
    //("res", res)

    // }
  }





  autoCompletionQuery(event) {

    /*if(this.value.length==1 && this.formerValueLength==0)
    {
      this.suggestions=[];
    }*/
    console.log("event",event,this.value);
    console.log(this.value);
    this.formerValueLength = this.value.length;
    
    let values = this.getData.getAutoComplete(this.value).subscribe(res => {
      /*
      [...res] créé une nouvelle référence, sans ca, ca ne fonctionne pas avec le code commenté ci dessous
      voir spread functions sur internet 
      */
      
      console.log("ici",res);
      this.suggestions =[...res];
      let i = 0;
      /* res.forEach(element => {
         this.suggestions[i] = element.word;
         i++;
       });*/


    })
  
  }

  autoCompletionRel(event) {

    /*if(this.value.length==1 && this.formerValueLength==0)
    {
      this.suggestions=[];
    }*/
    console.log("event",event,this.relation);
    console.log(this.relation);
    
    let values = this.getData.getRelationComplete(event.query).subscribe(res => {
      /*
      [...res] créé une nouvelle référence, sans ca, ca ne fonctionne pas avec le code commenté ci dessous
      voir spread functions sur internet 
      */
      this.suggestionsRel =[...res];


    })
  
  }

  //tous les if car il peut manquer certains éléments dans les réponses, comme pour le mot main
  orderRelations(allRelations) {

    console.log("calleddd")
    //déclenché quand on fait une nouvelle recherche, on réinitialise donc le tableau
    this.rows = [];
    this.rowsCopy = [];

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

        //ces types de relations ne sont pas indiqués dans les réponses, il faut les ajouter à la main
        //this.allRelationsTypes.push("rt;1;'r_raff_sem';raffinement semantique;Raffinement sémantique vers un usage particulier du terme source")
        //this.allRelationsTypes.push("rt;2;'r_raff_morpho';raffinement morphologique;Raffinement morphologique vers un usage particulier du terme source")

        this.relationTypes = [];
        this.allRelationsTypes.forEach((element, index) => {
          ///////////


          let tab: any[] = element.split(";");
          if (tab.length > 4) {
            this.relationTypes.push(
              { label: tab[2], value: tab[1] }
            )
            this.keyValueRelationTypes[tab[1]] = tab[2];

          }
        })
      } if (relationsTypes[1]) {

        leavingRelations = relationsTypes[1].split("// les relations entrantes : r;rid;node1;node2;type;w");
      }
    } if (leavingRelations) {
      if (leavingRelations[0]) {
        this.allLeavingRelations = leavingRelations[0].split("\n");
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

        //on remplit le tableau de key/value (idEntity->name)
        this.allEntities.forEach(element => {
          let tab = element.split(";");
          if (tab.length >= 5) {
            this.keyValueEntityId[tab[1]] = this.removeQuotes(tab[2]);

          }
        })

      }
      if (entities[0]) {
        /*on le réinitialise  après avoir vérifié qu'il entities[0] ne soit pas nul
        * (je n'ai jamais rencontré ce cas mais vaut mieux être trop prudent)
        * comme ça si c'est nul on peut quand meme filtrer
        */
        this.entitiesTypes = [];
        let typesEntity = entities[0].split("\n");
        typesEntity.forEach(element => {
          if (element.trim() != "") {
            if (element[0].trim() == "n" && element[1].trim() == "t")
              if (element.split(";")[2] && element.split(";")[1]) {
                this.entitiesTypes.push(
                  { label: element.split(";")[2], value: element.split(";")[1] }
                )
              }
          }
        });
        this.legend = entities[0];
        this.legendCopy = entities[0];
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

  orderRelationsForDialog(allRelations) {
    //déclenché quand on fait une nouvelle recherche, on réinitialise donc le tableau
    this.rowsDialog = [];
    // this.rowsCopy = [];

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
        this.allRelationsTypesForDialog = relationsTypes[0].split("\n");

        //ces types de relations ne sont pas indiqués dans les réponses, il faut les ajouter à la main
        //this.allRelationsTypes.push("rt;1;'r_raff_sem';raffinement semantique;Raffinement sémantique vers un usage particulier du terme source")
        //this.allRelationsTypes.push("rt;2;'r_raff_morpho';raffinement morphologique;Raffinement morphologique vers un usage particulier du terme source")

        // console.log("allrelationstypes", this.allRelationsTypes)
        /* this.relationTypes = [];
         this.allRelationsTypes.forEach((element, index) => {
           ///////////
 
 
           let tab: any[] = element.split(";");
           if (tab.length > 4) {
             this.relationTypes.push(
               { label: tab[2], value: tab[1] }
             )
             this.keyValueRelationTypes[tab[1]] = tab[2];
 
           }
         })*/
      } if (relationsTypes[1]) {

        leavingRelations = relationsTypes[1].split("// les relations entrantes : r;rid;node1;node2;type;w");
      }
    } if (leavingRelations) {
      if (leavingRelations[0]) {
        this.allLeavingRelationsForDialog = leavingRelations[0].split("\n");
      }
      if (leavingRelations[1]) {

        incomingRelations = leavingRelations[1].split("// END");
      }
    }
    if (incomingRelations) {
      if (incomingRelations[0]) {
        this.allIncomingRelationsForDialog = incomingRelations[0].split("\n");
      }
    }
    if (entities) {
      if (entities[1]) {


        this.allEntitiesForDialog = entities[1].split("\n");

        //on remplit le tableau de key/value (idEntity->name)
        this.allEntitiesForDialog.forEach(element => {
          let tab = element.split(";");
          if (tab.length >= 5) {
            this.keyValueEntityIdForDialog[tab[1]] = this.removeQuotes(tab[2]);

          }
        })

      }
      if (entities[0]) {
        /*on le réinitialise  après avoir vérifié qu'il entities[0] ne soit pas nul
        * (je n'ai jamais rencontré ce cas mais vaut mieux être trop prudent)
        * comme ça si c'est nul on peut quand meme filtrer
        */
        /*this.entitiesTypes = [];
        let typesEntity = entities[0].split("\n");
        typesEntity.forEach(element => {
          if (element.trim() != "") {
            if (element[0].trim() == "n" && element[1].trim() == "t")
              if (element.split(";")[2] && element.split(";")[1]) {
                this.entitiesTypes.push(
                  { label: element.split(";")[2], value: element.split(";")[1] }
                )
              }
          }
        });*/
        this.legendDialog = entities[0];
        this.legendCopyDialog = entities[0];
      }
      /*console.log("valeur firstPart", firstPart)
      console.log("valeur this.allrelationsTypes", this.allRelationsTypes)
      console.log("valeur allleavingRelations", this.allLeavingRelations)
      console.log("valeur allIncomingRelations", this.allIncomingRelations)
      console.log("valeur entities", entities)
      console.log("valeur allEntities", this.allEntities)*/
    }
    this.displaySelectionForDialog();


  }








  displayDialogEntity(event) {
    if (this.dropdownValue == "entities") {
      this.wordSelected = event.data.name;
      if (this.wordSelected[0] == "'") {
        this.wordSelected = this.wordSelected.split("'")[1];
      }
      this.display = true;

    }
    else if (this.dropdownValue == "leavingRelations") {

      let word = event.data.node2;

      if (word[0] == ":" && word[1] == "r") {

        this.isRelationReference = true;
        this.requestForRelationReference(word);
        this.display = true;

      }
      else {
        this.isRelationReference = false;
        this.wordSelected = word;
        this.display = true;
      }
    }
    else if (this.dropdownValue == "incomingRelations") {

      let word = event.data.node1;

      if (word[0] == ":" && word[1] == "r") {

        this.isRelationReference = true;
        this.requestForRelationReference(word);
        this.display = true;


      }
      else {
        this.isRelationReference = false;
        this.wordSelected = word;
        this.display = true;
      }
    }
    //this.display = true;
  }

  //appelée lors du changement du dropdown mais aussi à l'initialisation
  displaySelection() {
    //comme on change de sélection, on réinitialise
    this.rows = [];

    if (this.dropdownValue == "entities") {

      this.cols =
        [
          //  { field: 'ID', header: 'ID' },
          { field: 'name', header: 'Name' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' },
          //{ field: 'formatedName', header: 'Nom formaté' }
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
            name: this.removeQuotes(tab[2]),
            type: tab[3],
            //type: this.keyValueRelationTypes[tab[3]],
            weight: tab[4],
            // formatedName: "X"

          })
        }
        else if (tab.length == 6) {
          this.rows.push({


            ID: tab[1],
            name: this.removeQuotes(tab[5]),
            type: tab[3],
            // type: this.keyValueRelationTypes[tab[3]],

            weight: tab[4],
            // formatedName: tab[5]
          })
        }


      })
      this.rows = [...this.rows]
      this.legend = this.legendCopy;
      //this.legend = "Légende : les types de noeuds (Nodes Types) : nt;ntid;'ntname' nt;1;'n_term' nt;2;'n_form' nt;4;'n_pos' nt;6;'n_flpot' nt;8;'n_chunk' nt;9;'n_question' nt;10;'n_relation' nt;12;'n_analogy' nt;18;'n_data' nt;36;'n_data_pot' nt;444;'n_link' nt;666;'n_AKI' nt;777;'n_wikipedia'";
    }
    else if (this.dropdownValue == "relationType") {

      this.cols =
        [
          //{ field: 'ID', header: 'ID' },
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
          //{ field: 'ID', header: 'ID' },
          { field: 'node1', header: 'Node 1' },
          //{ field: 'node2', header: 'Node 2' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' }
        ]

      this.allIncomingRelations.forEach(element => {

        let tab: any[] = element.split(";");

        if (tab.length == 6) {
          if (this.keyValueEntityId[tab[2]]) {
            this.rows.push({
              ID: tab[1],
              node1: this.keyValueEntityId[tab[2]],
              node2: tab[3],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
          else {
            this.rows.push({
              ID: tab[1],
              node1: tab[2],
              node2: tab[3],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
        }

      });
      this.rows = [...this.rows]
      this.legend = "";
    }
    else if (this.dropdownValue == "leavingRelations") {
      this.cols =
        [
          //{ field: 'ID', header: 'ID' },
          // { field: 'node1', header: 'Node 1' },
          { field: 'node2', header: 'Node 2' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' }
        ]
      //let size: any[] = [];

      this.allLeavingRelations.forEach(element => {

        let tab: any[] = element.split(";");

        if (tab.length == 6) {
          if (this.keyValueEntityId[tab[3]]) {
            this.rows.push({
              ID: tab[1],
              node1: tab[2],
              node2: this.keyValueEntityId[tab[3]],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
          else {
            this.rows.push({
              ID: tab[1],
              node1: tab[2],
              node2: tab[3],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
        }

      });
      this.rows = [...this.rows]
      this.legend = "";
    }
    this.rowsCopy = this.rows;

  }

  displaySelectionForDialog() {
    //comme on change de sélection, on réinitialise
    this.rowsDialog = [];

    if (this.dropdownValueDialog == "entities") {

      this.colsDialog =
        [
          //{ field: 'ID', header: 'ID' },
          { field: 'name', header: 'Name' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' },
          //{ field: 'formatedName', header: 'Nom formaté' }
        ]

      this.allEntitiesForDialog.forEach(element => {

        let tab: any[] = element.split(";");
        //j'ai vérifié que la longueur des entités était bien 5 ou 6
        /* if(cpt[tab.length])
         cpt[tab.length]++;
         else cpt[tab.length]=1;*/
        if (tab.length == 5) {
          this.rowsDialog.push({
            ID: tab[1],
            name: this.removeQuotes(tab[2]),
            type: tab[3],
            //type: this.keyValueRelationTypes[tab[3]],
            weight: tab[4],
            // formatedName: "X"

          })
        }
        else if (tab.length == 6) {
          this.rowsDialog.push({


            ID: tab[1],
            name: this.removeQuotes(tab[5]),
            type: tab[3],
            // type: this.keyValueRelationTypes[tab[3]],

            weight: tab[4],
            // formatedName: tab[5]
          })
        }


      })
      this.rowsDialog = [...this.rowsDialog]
      this.legendDialog = this.legendCopyDialog;
      //this.legend = "Légende : les types de noeuds (Nodes Types) : nt;ntid;'ntname' nt;1;'n_term' nt;2;'n_form' nt;4;'n_pos' nt;6;'n_flpot' nt;8;'n_chunk' nt;9;'n_question' nt;10;'n_relation' nt;12;'n_analogy' nt;18;'n_data' nt;36;'n_data_pot' nt;444;'n_link' nt;666;'n_AKI' nt;777;'n_wikipedia'";
    }
    else if (this.dropdownValueDialog == "relationType") {

      this.colsDialog =
        [
          //{ field: 'ID', header: 'ID' },
          { field: 'rtname', header: 'Name' },
          { field: 'trgpname', header: 'TRGPNAME' },
          { field: 'rthelp', header: 'Help' }
        ]

      this.allRelationsTypesForDialog.forEach(element => {

        let tab: any[] = element.split(";");
        //si tab.length > 5 alors il y a un ";" dans la partie "Help" des relations, on doit donc rassembler
        if (tab.length > 5) {
          for (let i = 5; i < tab.length; i++) {
            tab[4] += ";" + tab[i];
          }
        }

        if (tab.length > 4) {
          this.rowsDialog.push({
            ID: tab[1],
            rtname: tab[2],
            trgpname: tab[3],
            rthelp: tab[4]
          })
        }

      });
      this.rowsDialog = [...this.rowsDialog]
      this.legendDialog = "";

    }
    else if (this.dropdownValueDialog == "incomingRelations") {

      this.colsDialog =
        [
          //{ field: 'ID', header: 'ID' },
          { field: 'node1', header: 'Node 1' },
          //{ field: 'node2', header: 'Node 2' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' }
        ]

      this.allIncomingRelationsForDialog.forEach(element => {

        let tab: any[] = element.split(";");

        if (tab.length == 6) {
          if (this.keyValueEntityIdForDialog[tab[2]]) {
            this.rowsDialog.push({
              ID: tab[1],
              node1: this.keyValueEntityIdForDialog[tab[2]],
              node2: tab[3],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
          else {
            this.rowsDialog.push({
              ID: tab[1],
              node1: tab[2],
              node2: tab[3],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
        }

      });
      this.rowsDialog = [...this.rowsDialog]
      this.legendDialog = "";
    }
    else if (this.dropdownValueDialog == "leavingRelations") {

      this.colsDialog =
        [
          //{ field: 'ID', header: 'ID' },
          // { field: 'node1', header: 'Node 1' },
          { field: 'node2', header: 'Node 2' },
          { field: 'type', header: 'Type' },
          { field: 'weight', header: 'Weight' }
        ]
      //let size: any[] = [];

      this.allLeavingRelationsForDialog.forEach(element => {

        let tab: any[] = element.split(";");

        if (tab.length == 6) {
          if (this.keyValueEntityIdForDialog[tab[3]]) {
            this.rowsDialog.push({
              ID: tab[1],
              node1: tab[2],
              node2: this.keyValueEntityIdForDialog[tab[3]],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
          else {
            this.rowsDialog.push({
              ID: tab[1],
              node1: tab[2],
              node2: tab[3],
              type: tab[4],
              //type: this.keyValueRelationTypes[tab[4]],

              weight: tab[5]
            })
          }
        }

      });
      this.rowsDialog = [...this.rowsDialog]
      this.legendDialog = "";
    }
    //this.rowsCopy = this.rows;
  }



  mysort(event) {
    //par défaut le sort de p-datatable utilise l'ordre alphanumérique sur les chiffres, donc 9>80, il faut donc changer le tri

    if (event.field == "ID" || event.field == "type" || event.field == "weight"/* || event.field == "node1" || event.field == "node2"*/) {

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


    if (this.response) {
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
        this.rowsCopy = [];
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
      this.rowsCopy = [];
      this.allEntities = [];
      this.allRelationsTypes = [];
      this.allLeavingRelations = [];
      this.allIncomingRelations = [];
      // this.relations="Aucune relation..."
    }
  }



  filterByRelationTypes(event) {
    this.rows = [];
    this.rowsCopy.forEach(element => {

      //on check si les valeurs sélectionnées contiennent le type de l'élément sur lequel on itère
      if (event.value.includes(element.type)) {
        this.rows.push(element);
      }


    })
  }

  filterByEntityTypes(event) {
    this.rows = [];
    this.rowsCopy.forEach(element => {
      if (event.value.includes(element.type)) {
        this.rows.push(element);
      }
    })
  }


  // on réinitialise le filtre quand on change la valeur du dropdown (celle n'est
  //pas implicitement pris en charge pas primeNG
  //dt.filteredValue contient l'ensemble des valeurs filtrées (on remet donc toutes les lignes si on change la valeur du dropdown)
  //dt.filters est un objet contenant chaque colonne filtrée, on réinitialise donc l'objet
  resetFilter(dt: DataTable) {
    dt.filteredValue = [...this.rowsCopy];
    dt.filters = {}
  }

  //fonction pour retirer les quotes autour des certaines valeurs 
  removeQuotes(s: String): any {

    return s.substring(1, s.length - 1);

  }

}


