'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';


export default class Sidebar extends React.PureComponent {
  render() {
    return (
      <div>
        <div className="card mb-3" style={{ width: '16rem' }}>
          <h5 className="card-header" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {this.props.name || 'Worker'}
          </h5>
          <div className="list-group list-group-flush">
            {this.renderItem('info-circle', '/worker', '概要')}
            {this.renderItem('microchip', '/worker/backends', '后端')}
            {this.renderItem('plug', '/worker/edit', '连接')}
            {this.renderItem('pen', '/worker/config', '配置')}
            {/*{this.renderItem('tools', '/worker/tools', 'Tools')}*/}
          </div>
        </div>

        <div className="card mb-3" style={{ width: '16rem' }}>
          <div className="list-group list-group-flush">
            {this.renderItem('flask', '/worker/dev', '开发调试')}
          </div>
        </div>
      </div>
    );
  }


  renderItem(icon, path, name) {
    return (
      <Link className={cn('list-group-item', { active: this.props.pathname === path })} to={path + this.props.search}><Icon icon={icon} fixedWidth /> {name}</Link>
    );
  }
}
