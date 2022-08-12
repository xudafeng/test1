import { Helper } from '../helper';

const applescript = require('applescript');
const shell = require('shelljs');
const scptDir = `${Helper.getResourcePath()}/applescript/scpt`;

// 直接执行 AppleScript 脚本/脚本包
export const osaUtil = {

  async execAppleScriptStr(funcStr): Promise<any> {
    return new Promise((resolve, reject) => {
      applescript.execString(funcStr, (err, rtn) => {
        if (err) {
          console.error(err);
          reject('Something went wrong!');
        }
        resolve(rtn);
      });
    });
  },

  /**
   * 文件要求以 applescript 结尾的源码
   * @param file
   * @param args
   */
  async execAppleScriptFile(file: string, args = []): Promise<any> {
    if (!file.endsWith('.applescript')) {
      console.error('只支持applescript格式文件');
      return;
    }
    return new Promise((resolve, reject) => {
      applescript.execFile(file, args, (err, rtn) => {
        if (err) {
          console.error(err);
          reject('Something went wrong!');
        }
        resolve(rtn);
      });
    });
  },

  /**
   * 执行scpt文件
   */
  execScptFile(file: string, args = []) {
    if (!file.endsWith('.scpt')) {
      console.error('只支持scpt格式文件');
      return;
    }
    shell.chmod('+x', file);
    const cmd = `osascript '${file}' ${args.join(' ')} -ss`;
    Helper.debug(cmd);
    const res = shell.exec(cmd, { silent: true }).stdout;
    Helper.debug(res);
    return res;
  },

  /**
   * applescript 实现
   * jxa运行applescript lib会有问题 只能通过shell执行
   * - 适用原生MacOS的应用（实际点击的是坐标所在的UI元素）,不适用Electron
   * - FIXME 似乎只能点击到到执行脚本的应用窗口，否则卡死
   * @param opts
   */
  click(opts: {
    x: number;
    y: number;
  }) {
    Helper.debug(opts);
    this.execScptFile(`${scptDir}/mouseClick.scpt`, [ opts.x, opts.y ]);
  },
};
