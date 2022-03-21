'use strict';

import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import ClipboardButton from 'react-clipboard.js';
import AsyncModal from './AsyncModal';
import {Header, Footer, Cancel, Title, Body, LargeModal} from './Modal';
import {showModal} from "../../app/modals";
import {MODAL_EXPORT} from "../../constants/ModalTypes";
import v1 from '../../app/serialization/v1';


export default class ExportModal extends AsyncModal {
  static show() {
    return showModal(MODAL_EXPORT, {});
  }


  render() {
    return (
      <LargeModal>
        <Header dismiss={this.props.dismiss}>
          <Title>导出设置及矿工</Title>
        </Header>
        <div className="alert alert-warning rounded-0 mb-0">
          复制下面的网址并在另一个浏览器上打开导入它.
        </div>
        <Body>
          <pre id="url">{window.location.origin}/import/{v1.serialize()}</pre>
        </Body>
        <Footer>
          <ClipboardButton button-title="Copy" className="btn btn-success" data-clipboard-target="#url" onSuccess={this.onCopied}><span><Icon icon="copy" /> 复制 & 关闭</span></ClipboardButton>
          <Cancel dismiss={this.props.dismiss} />
        </Footer>
      </LargeModal>
    );
  }


  onCopied = () => {
    this.resolve(null);
  };
}
