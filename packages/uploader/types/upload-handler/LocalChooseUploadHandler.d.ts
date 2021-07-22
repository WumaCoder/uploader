/// <reference types="wechat-miniprogram" />
import { UploadHandler } from "../core/UploadHandler";
export declare class LocalChooseUploadHandlerOption {
    exts: string[];
    count: number;
    type: "all" | "video" | "image" | "file";
    cate?: Cate;
    size?: number;
    prefix?: string;
}
export declare type RequestHandler = (files: UploadAliyunFile[]) => Promise<string> | void;
export declare class LocalChooseUploadHandler extends UploadHandler {
    private _option;
    private _requestHandler;
    constructor(option: LocalChooseUploadHandlerOption, requestHandler: RequestHandler);
    name(): string;
    upload(): Promise<any>;
    option(): LocalChooseUploadHandlerOption;
}
declare type Cate = "record" | "video" | "img" | "answer_img" | "file" | "album" | "disk";
export declare class UploadAliyunFile {
    cate: Cate;
    file: string;
    new_name: string;
    size: number;
    duration?: number;
}
export declare class CantUseApiException extends Error {
    readonly name: string;
    type: string;
    constructor(api: string);
}
export declare class VerifyFileException extends Error {
    readonly name: string;
    type: string;
    file: WechatMiniprogram.ChooseFile;
    constructor(type: any, file: any);
}
export declare class UploadFileException extends Error {
    readonly name: string;
    type: string;
    result: WechatMiniprogram.UploadFileSuccessCallbackResult;
    constructor(res: any);
}
export {};
//# sourceMappingURL=LocalChooseUploadHandler.d.ts.map