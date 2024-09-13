import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
} 

interface PerspectiveViewerElement extends HTMLElement {
    load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
    table: Table | undefined;

    render() {
        return React.createElement('perspective-viewer');
    }

    componentDidMount() {
        // Get element from the DOM.
        const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      price_abc: 'float',
      price_def: 'float',
      ratio: 'float',
      timestamp: 'date',
      lower_bound: 'float',
      upper_bound: 'float',
      trigger_alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert  "]');
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        timestamp: 'distinct count',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      // Convert Row[] to TableData
      const rows = DataManipulator.generateRow(this.props.data);
      const tableData: TableData = {
        price_abc: rows.map(row => row.price_abc),
        price_def: rows.map(row => row.price_def),
        ratio: rows.map(row => row.ratio),
        timestamp: rows.map(row => row.timestamp),
        lower_bound: rows.map(row => row.lower_bound),
        upper_bound: rows.map(row => row.upper_bound),
        trigger_alert: rows.map(row => row.trigger_alert), 
      };

      this.table.update(tableData);
    }
  }
}

export default Graph;