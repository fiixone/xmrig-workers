'use strict';

import React from 'react';
import WorkerRow from "./worker/WorkerRow";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import AddWorkerModal from "./modals/AddWorkerModal";


export default class Workers extends React.PureComponent {
  render() {
    return (
      <div className="container-fluid">
        {this.renderBody()}
      </div>
    );
  }


  renderBody() {
    if (this.props.workers.keys.length === 0) {
      return this.renderAlert();
    }

    return this.renderWorkers();
  }


  renderAlert() {
    return (
      <div className="alert alert-danger" role="alert">
        <Icon icon="exclamation-triangle" /> 没有发现矿工, 点击<a href="#" onClick={this.add} className="alert-link">添加</a> 矿工Worker.
      </div>
    );
  }


  renderWorkers() {
    const { workers } = this.props;

    return (
      <div className="card">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th className="border-0">矿工 <span className="badge badge-dark badge-pill">{workers.keys.length}</span></th>
                <th className="border-0">算力</th>
                <th className="border-0">状态</th>
                <th className="border-0">矿池</th>
              </tr>
            </thead>
            <tbody>
              {workers.keys.map(url => (< WorkerRow
                key={url}
                worker={workers.values[url]}
              />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  add = () => {
    AddWorkerModal.show()
      .catch(err => null);
  }
}
