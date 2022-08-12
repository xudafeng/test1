#!/usr/bin/env ts-node

/**
 * @Description macaca-macos cli工具
 */

import { MacacaMacOS } from '../src/macaca-macos';

process.setMaxListeners(0);
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  process.exit(1);
});

const { program } = require('commander');
const os = require('os');
const chalk = require('chalk');

const getLogoStr = () => {
  const lines = [
    ' __  __                             __  __             ___  ____ ',
    '|  \\/  | __ _  ___ __ _  ___ __ _  |  \\/  | __ _  ___ / _ \\/ ___| ',
    '| |\\/| |/ _` |/ __/ _` |/ __/ _` | | |\\/| |/ _` |/ __| | | \\___ \\',
    '| |  | | (_| | (_| (_| | (_| (_| | | |  | | (_| | (__| |_| |___) |',
    '|_|  |_|\\__,_|\\___\\__,_|\\___\\__,_| |_|  |_|\\__,_|\\___|\\___/|____/ ',
  ];
  return chalk.green(lines.join(os.EOL));
};

program
  .addHelpText('before', getLogoStr())
  .version('1.0.0');

program
  .command('relative_mouse_pos [appName]')
  .alias('rmp')
  .description('获取鼠标在APP上的相对位置(app界面左上角坐标: 0, 0)')
  .action(async (appName) => {
    const driver = new MacacaMacOS();
    const realPos = driver.mouseGetPos();
    const appPos = await driver.getAppSizePosition(appName);
    const relativePos = `${realPos.x - appPos.topLeftX},${realPos.y - appPos.topLeftY}`;
    console.log(`${appName}窗口相对坐标: ${relativePos} 已复制到剪贴板`);
    await driver.setClipText(relativePos);
  });

program.parse(process.argv);