import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './KendoUiWebPart.module.scss';
import * as strings from 'KendoUiWebPartStrings';

import * as $ from 'jquery';
require('../../../node_modules/@progress/kendo-ui');
import '@progress/kendo-ui';
require('../../../node_modules/@progress/kendo-ui/css/web/kendo.common.min.css');
require('../../../node_modules/@progress/kendo-ui/css/web/kendo.default.min.css');

export interface IKendoUiWebPartProps {
  description: string;
}

export default class KendoUiWebPart extends BaseClientSideWebPart<IKendoUiWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div id ="grid"></div>
    `;
//This is sample local data for demo purpose. Data can be sourced from SP List, Azure SQL or any other source of your choice
    var sampleData = [
      { ProductID: 1, ProductName: "Apple iPhone 5s", Introduced: new Date(2013, 8, 10), UnitPrice: 525, Discontinued: false, UnitsInStock: 10 },
      { ProductID: 2, ProductName: "HTC One M8", Introduced: new Date(2014, 2, 25), UnitPrice: 425, Discontinued: false, UnitsInStock: 3 },
      { ProductID: 3, ProductName: "Nokia 5880", Introduced: new Date(2008, 10, 2), UnitPrice: 275, Discontinued: true, UnitsInStock: 0 }
    ];

    var sampleDataNextID = sampleData.length + 1;
    function getIndexById(id) {
      var idx,
        l = sampleData.length;
      for (var j = 0; j < l; j++) {
        if (sampleData[j].ProductID == id) {
          return j;
        }
      }
      return null;
    }

    var dataSource = new kendo.data.DataSource({
      transport: {
        read: (e) => { //Converting function to arrow to comply with TypeScript
          e.success(sampleData);
        },
        create: (e) => {
          // assign an ID to the new item
          e.data.resourceid = sampleDataNextID++;
          // save data item to the original datasource
          sampleData.push(e.data);
          e.success(e.data);
        },
        update: (e) => {
          // locate item in original datasource and update it
          sampleData[getIndexById(e.data.ProductID)] = e.data;
          e.success();
        },
        destroy: (e) => {
          // locate item in original datasource and remove it
          sampleData.splice(getIndexById(e.data.resourceid), 1);
          e.success();
        }
      },
      error: (e) => {
        // handle data operation error
        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
      },
      pageSize: 10,
      batch: false,
      schema: {
        model: {
          id: "ProductID",
          fields: {
            ProductID: { editable: false, nullable: true },
            ProductName: { validation: { required: true } },
            Introduced: { type: "date" },
            UnitPrice: { type: "number", validation: { required: true, min: 1 } },
            Discontinued: { type: "boolean" },
            UnitsInStock: { type: "number", validation: { min: 0, required: true } }
          }
        }
      }
    });

    $("#grid").kendoGrid({
      dataSource: dataSource,
      pageable: true,
      toolbar: ["create"],
      columns: [
        { field: "ProductID" },
        { field: "ProductName", title: "Mobile Phone" },
        { field: "Introduced", title: "Introduced", format: "{0:yyyy/MM/dd}"},
        { field: "UnitPrice", title: "Price", format: "{0:c}"},
        { field: "UnitsInStock", title: "Units In Stock"},
        { field: "Discontinued", width: "120px" },
        { command: ["edit", "destroy"], title: "&nbsp;", width: "200px" }
      ],
      editable: "inline"
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
