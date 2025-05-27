export { default as fileExplorer } from './file-explorer';
export { default as codeEditor } from './code-editor';
export { default as terminal } from './terminal';
export { default as browser } from './browser';
export { default as databaseViewer } from './database-viewer';
export { default as apiTester } from './api-tester';
export { default as gitClient } from './git-client';
export { default as dockerManager } from './docker-manager';
export { default as logViewer } from './log-viewer';
export { default as performanceMonitor } from './performance-monitor';
export { default as securityScanner } from './security-scanner';
export { default as deploymentTool } from './deployment-tool';
export { default as collaborationHub } from './collaboration-hub';

export const mcpTools = {
  'file-explorer': () => import('./file-explorer'),
  'code-editor': () => import('./code-editor'),
  'terminal': () => import('./terminal'),
  'browser': () => import('./browser'),
  'database-viewer': () => import('./database-viewer'),
  'api-tester': () => import('./api-tester'),
  'git-client': () => import('./git-client'),
  'docker-manager': () => import('./docker-manager'),
  'log-viewer': () => import('./log-viewer'),
  'performance-monitor': () => import('./performance-monitor'),
  'security-scanner': () => import('./security-scanner'),
  'deployment-tool': () => import('./deployment-tool'),
  'collaboration-hub': () => import('./collaboration-hub'),
};