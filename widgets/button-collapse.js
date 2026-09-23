import { createMessageButtonOwnership } from '../core/message-button-ownership.js';

const messageButtonOwnership = createMessageButtonOwnership();

const initButtonCollapse = () => {
  // 彻底停用折叠功能，并注入一小段 CSS 修复原生按钮栏过长被头像遮挡的问题
  const style = document.createElement('style');
  style.textContent = `
    .mes_block .mes_buttons {
      flex-wrap: wrap !important;
      z-index: 10;
    }
  `;
  document.head.appendChild(style);
};

// 永远返回 false，这样所有的小白X按钮（剧情总结、大纲等）都会像普通按钮一样乖乖排在外面
const registerButtonToSubContainer = () => false;

const cleanup = () => {};
const processButtonCollapse = () => {};
const createButtonCollapseCleanup = () => () => {};
const configureButtonCollapseRuntime = ({ ownsMessageButtons = true } = {}) => {
  messageButtonOwnership.configure(ownsMessageButtons);
};

if (typeof window !== 'undefined') {
  Object.assign(window, {
    initButtonCollapse,
    cleanupButtonCollapse: cleanup,
    registerButtonToSubContainer,
    processButtonCollapse,
  });
}

export { initButtonCollapse, cleanup, registerButtonToSubContainer, processButtonCollapse, createButtonCollapseCleanup, configureButtonCollapseRuntime };
