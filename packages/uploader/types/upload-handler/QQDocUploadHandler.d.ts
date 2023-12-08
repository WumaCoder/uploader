import { Cate, FileMeta, UploadHandler, VerifyContentHandler } from "../core/UploadHandler";
export type OAuthHandlerRes = {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
    refresh_token: string;
    user_id: string;
    scope: string;
    client_id: string;
};
export type OAuthHandler = (oAuthHandlerRes?: OAuthHandlerRes) => Promise<OAuthHandlerRes>;
export declare class QQDocUploadHandlerOption {
    exts: string[];
    count: number;
    type: "file";
    cate?: Cate;
    size?: number;
    prefix?: string;
    maxAge?: number;
    oauthHandler: OAuthHandler;
    selectFileView?: (fetch: (type: "next") => Promise<FileMeta[]>) => Promise<FileMeta[]>;
    verifyContentHandler: VerifyContentHandler;
}
export declare enum QQDocHook {
    GET_TOKEN_OK = "getTokenOk",
    BEFORE_FILTER = "beforeFilter",
    AFTER_FILTER = "afterFilter"
}
/**
 * 腾讯文档上传处理器
 */
export declare class QQDocUploadHandler extends UploadHandler<QQDocUploadHandlerOption, QQDocHook> {
    private _token;
    private _aboutPool;
    constructor(option: QQDocUploadHandlerOption);
    upload(): Promise<FileMeta[]>;
    private driveFilter;
    private request;
    destroy(): void;
    about(): Promise<void>;
}
//# sourceMappingURL=QQDocUploadHandler.d.ts.map