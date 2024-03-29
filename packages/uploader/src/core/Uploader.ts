import { __DEV__ } from "./env";
import { optionHander } from "../utils/Function";

import {
  UploadHandler,
  UploadHook,
  HookCb,
  FileMeta,
  UploadHandlerConstruction,
} from "./UploadHandler";

export class Uploader<O> {
  private _uploadHandler: UploadHandler<O>;
  private _option: O;
  private _isRun: boolean;

  /**
   * @param  {UploadHandlerConstruction<O>} UploadHandler // 传输器
   * @param  {O} option? 传给 UploadHandler 的选项
   */
  constructor(UploadHandler: UploadHandlerConstruction<O>, option?: O) {
    this.loadUploadHandler(UploadHandler, option);
  }

  /**
   * 同上
   * @param  {UploadHandlerConstruction<O>} LoadUploadHandler
   * @param  {O} option?
   * @returns Uploader
   */
  loadUploadHandler(
    LoadUploadHandler: UploadHandlerConstruction<O>,
    option?: O
  ): Uploader<O> {
    if (
      this._uploadHandler &&
      this._uploadHandler instanceof LoadUploadHandler
    ) {
      return this;
    }
    this._isRun = false;
    let hook = null;
    if (this._uploadHandler) {
      this._uploadHandler.about();
      hook = this._uploadHandler.hook();
    }
    this._option = optionHander(option, this._option);
    this._uploadHandler = new LoadUploadHandler(this._option);
    this._uploadHandler.hook(hook);

    if (!(this._uploadHandler instanceof LoadUploadHandler)) {
      throw new Error("@sharedkit/Uploader: uploadHandler load error");
    }

    this._uploadHandler.hook().asyncEmit(UploadHook.CREATED, this);

    return this;
  }

  /**
   * 开始上传
   * @returns Uploader
   */
  upload(tempFiles?: WechatMiniprogram.ChooseFile[]): Uploader<O> {
    if (this._isRun) {
      return this;
    }
    this._isRun = true;
    this._uploadHandler
      .upload(tempFiles)
      .then((res) => {
        this._isRun = false;
        this._uploadHandler.hook().emit(UploadHook.UPLOADED, res);
        this._uploadHandler.hook().emit(UploadHook.WAIT, null, res);
      })
      .catch((err) => {
        this._isRun = false;
        this._uploadHandler.hook().emit(UploadHook.ERROR, err);
        this._uploadHandler.hook().emit(UploadHook.WAIT, err, null);
      });
    return this;
  }

  /**
   * 监听一个钩子
   * @param  {H} hook 钩子类型
   * @param  {HookCb<H>} cb 回调函数
   * @returns Uploader
   */
  on<H extends UploadHook>(hook: H, cb: HookCb<H>): Uploader<O> {
    this._uploadHandler.hook().on(hook, cb);
    return this;
  }

  /**
   * 移除一个钩子
   * @param  {H} hook
   * @param  {HookCb<H>} cb
   * @returns Uploader
   */
  off<H extends UploadHook>(hook: H, cb: HookCb<H>): Uploader<O> {
    this._uploadHandler.hook().off(hook, cb);
    return this;
  }

  /**
   * 监听一个钩子, 但只监听一次
   * @param  {H} hook 钩子类型
   * @param  {HookCb<H>} cb 回调函数
   * @returns Uploader
   */
  once<H extends UploadHook>(hook: H, cb: HookCb<H>): Uploader<O> {
    this._uploadHandler.hook().once(hook, cb);
    return this;
  }

  /**
   * 等待Uplaoder上传完成
   * */
  wait(): Promise<FileMeta[]> {
    return new Promise((resolve, reject) => {
      this.once(UploadHook.WAIT, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  /**
   * 获取或者修改选项
   * @param  {O} option? 传入的选项
   */
  option(option?: O) {
    return this._uploadHandler.option(option);
  }

  /**
   * 销毁
   * @returns void
   */
  destroy(): void {
    this._uploadHandler.destroy();
    this._uploadHandler.hook().emit(UploadHook.DESTROYED);
    this._uploadHandler
      .hook()
      .events()
      .forEach((_, k) => this._uploadHandler.hook().remove(k));
  }

  about(): Uploader<O> {
    if (this._isRun) {
      this._uploadHandler.about();
      this._uploadHandler.hook().emit(UploadHook.ABOUT);
    }
    return this;
  }

  uploadHandler(handler: UploadHandlerConstruction<O>) {
    if (handler) {
      this.loadUploadHandler(handler);
    }
    return this._uploadHandler;
  }
}
