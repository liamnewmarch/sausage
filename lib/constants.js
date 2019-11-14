export const CLI_ARG_FLAG = /^(?:--)(?<flag>[\w]+)/;
export const CLI_ARG_MIXED = /^(?:--)(?:[\w]+)=(?!--)(?<value>.+)$/;
export const CLI_ARG_VALUE = /^(?!--).+$/;

export const CLI_MESSAGE_START = 'Building...';
export const CLI_MESSAGE_END = 'done.';

export const DEFAULT_CONFIG_FILENAME = 'sausage.config.js';
