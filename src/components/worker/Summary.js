'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import isNumber from 'lodash/isNumber';
import Workers from "../../app/Workers";
import cn from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import Hashrate from "./labels/Hashrate";
import Uptime from "./labels/Uptime";
import Ping from "./labels/Ping";
import AvgTime from "./labels/AvgTime";
import CpuModal from "../modals/CpuModal";
import FeatureModal from "../modals/FeatureModal";


export default class Summary extends React.PureComponent {
  constructor(props) {
    super(props);
  }


  render() {
    const { summary } = Workers.getSync(this.props.url);
    const ok = summary && summary.status === 200;

    return (
      <div>
        <div className={cn('card', 'mb-3', { 'border-danger': !ok })}>
          <h5 className={cn('card-header', { 'text-white': !ok }, { 'bg-danger': !ok })}>
            矿工 {ok && summary.kind !== 'miner' ? <span className="badge badge-primary">{summary.kind}</span> : ''}
            <div className="btn-group float-right">
              <Link className={cn('btn', { 'btn-primary': !ok }, { 'btn-outline-primary': ok})} to={'/worker/edit?url=' + encodeURIComponent(this.props.url)} title="编辑矿工信息"><Icon icon="pen" /></Link>
              <button className={cn('btn', { 'btn-primary': !ok }, { 'btn-outline-primary': ok})} onClick={this.handleRefresh} title="刷新"><Icon icon="sync-alt" /></button>
            </div>
          </h5>
          {this.renderFields(summary)}
        </div>

        {Summary.renderMining(summary, this.props.url)}
        {Summary.renderConnection(summary)}
      </div>
    );
  }


  renderFields(summary) {
    if (!summary || summary.status !== 200) {
      return (
        <div className="card-body text-danger">
          <Icon icon="exclamation-triangle" /> 无法获取摘要信息.
        </div>
      );
    }

    const { cpu, donate_level, uptime } = summary;

    return (
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <tbody>
            <tr>
              <td className="border-top-0 text-muted" style={{width: 120}}>版本</td>
              <td className="border-top-0 font-weight-bold">
                <span className="badge badge-primary">{summary.version}</span>{' '}
                {Summary.renderX64(cpu)}{' '}
                <small className="text-muted">{summary.ua}</small>
              </td>
            </tr>
            {this.renderCPU(cpu)}
            {Summary.renderUptime(uptime)}
            <tr className={cn({'table-danger': donate_level < 0})}>
              <td className={`text-${donate_level <= 0 ? 'muted' : 'danger'}`}>捐献</td>
              <td className={`text-${donate_level <= 0 ? 'success' : 'danger'}`}>{donate_level}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }


  static renderX64(cpu) {
    if (cpu) {
      return <span className={`badge badge-${cpu.x64 ? 'success' : 'danger'}`}>{cpu.x64 ? '64' : '32'}-bit</span>;
    }
  }


  renderCPU(cpu) {
    if (cpu) {
      return (
        <tr>
          <td className="text-muted">CPU</td>
          <td><a href="#" onClick={this.handleShowCPU}>{cpu.brand}</a> {CpuModal.renderFeature(cpu.aes, 'AES')}</td>
        </tr>
      );
    }
  }


  static renderMining(summary, url) {
    if (!summary || summary.status !== 200) {
      return;
    }

    const { hashrate, results } = summary;
    const good  = results.shares_good;
    const bad   = results.shares_total - results.shares_good;
    const error = (hashrate.total[0] === null || hashrate.total[0] < 0.1) || (bad && !good);

    return (
      <div className={cn('card', 'mb-3', { 'border-danger': error })}>
        <h5 className={cn('card-header', { 'text-white': error }, { 'bg-danger': error })}>
          挖矿
          <div className="btn-group float-right">
            <Link className={cn('btn', { 'btn btn-outline-light': error}, { 'btn-outline-primary': !error })} to={'/worker/backends?url=' + encodeURIComponent(url)} title="后端"><Icon icon="microchip" /></Link>
          </div>
        </h5>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <tbody>
              <tr>
                <td className="border-top-0 text-muted" style={{width: 120}}>算力(H/s)</td>
                <td className="border-top-0">
                  <small className="text-muted">10s</small> <Hashrate value={hashrate.total[0]} />{' '}
                  <small className="text-muted">1m</small> <Hashrate value={hashrate.total[1]} />{' '}
                  <small className="text-muted">15m</small> <Hashrate value={hashrate.total[2]} />{' '}
                  <small className="text-muted">最高</small> <Hashrate value={hashrate.highest} type="secondary" />
                </td>
              </tr>
              <tr>
                <td className="text-muted">统计</td>
                <td>
                  <small className="text-muted">接受</small> <span className={`badge badge-${good ? 'success' : 'info'}`}>{good}</span>{' '}
                  <small className="text-muted">拒绝</small> <span className={`badge badge-${bad ? 'danger' : 'success'}`}>{bad}</span>{' '}
                  <small className="text-muted">平均耗时</small> <AvgTime value={results.avg_time} />{' '}
                  <small className="text-muted">总提交哈希</small> <span className="badge badge-info">{results.hashes_total}</span>{' '}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  static renderConnection(summary) {
    if (!summary || summary.status !== 200 || !summary.connection) {
      return;
    }

    const { pool, uptime, ping, tls } = summary.connection;

    return (
      <div className={cn('card', 'mb-3', { 'border-danger': uptime === 0 })}>
        <h5 className={cn('card-header', { 'text-white': uptime === 0 }, { 'bg-danger': uptime === 0 })}>
          连接
        </h5>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <tbody>
              <tr>
                <td className="border-top-0 text-muted" style={{width: 120}}>矿池</td>
                <td className="border-top-0">
                  <b>{pool}</b>{' '}
                  {tls ? <span className="badge badge-success">{tls}</span> : ''}{' '}
                  <small className="text-muted">难度(diff)</small> <span className="badge badge-info">{summary.results.diff_current}</span>{' '}
                  <small className="text-muted">算法(alog)</small> <span className="badge badge-dark">{summary.algo}</span>{' '}
                  <small className="text-muted">延迟(ping)</small> <Ping value={ping} />
                </td>
              </tr>
              {Summary.renderUptime(uptime)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  static renderUptime(uptime) {
    if (!isNumber(uptime)) {
      return;
    }

    return (
      <tr>
        <td className="text-muted">上线时长</td>
        <td><Uptime value={uptime} /></td>
      </tr>
    );
  }


  handleRefresh = event => {
    Workers.getSync(this.props.url).refresh();
  };


  handleShowCPU = event => {
    event.preventDefault();

    const cpu = Workers.getSync(this.props.url).summary.cpu;

    if (!cpu) {
      return;
    }

    if (cpu.backend) {
      CpuModal.show(cpu);
    }
    else {
      FeatureModal.show();
    }
  }
}
