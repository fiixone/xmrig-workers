'use strict';

import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import AsyncModal from './AsyncModal';
import {Header, Footer, Cancel, Title, LargeModal} from './Modal';
import {showModal} from "../../app/modals";
import {MODAL_FEATURE} from "../../constants/ModalTypes";


export default class FeatureModal extends AsyncModal {
  static show() {
    return showModal(MODAL_FEATURE, {})
  }


  render() {
    return (
      <LargeModal>
        <Header dismiss={this.props.dismiss}>
          <Title>缺少功能</Title>
        </Header>
        <div className="alert alert-danger rounded-0 mb-0">
          <Icon icon="exclamation-triangle" className="text-danger" /> 将您的矿机更新到最新版本以获取此功能.
        </div>
        <Footer>
          <Cancel dismiss={this.props.dismiss} />
        </Footer>
      </LargeModal>
    );
  }
}
