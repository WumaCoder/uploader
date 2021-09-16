import { UrlParser } from "./../utils/UrlParser";
import { optionHander } from "../utils/Function";
import { uuid } from "../utils/UniqueCode";
import {
  UploadHandler,
  FileMeta,
  UploadHook,
  VerifyFileException,
  UploadHandlerConstruction,
  VerifyContentHandler,
  Cate,
} from "../core/UploadHandler";

export class LocalChooseUploadHandlerOption {
  exts: string[] = []; // 限制文件后缀，最后会传给微信API
  count: number = 1; // 限制文件数量，最后会传给微信API
  type: "all" | "video" | "image" | "file" = "all"; // 类型，给微信API的
  cate?: Cate; // 会传给 aliyunOss 这个方法, 如果不传会通过type推算
  size?: number = 1024 * 1024 * 3; // B, default 3MB 限制大小
  prefix?: string = ""; // 资源路径前缀
  uploadFileHandler: uploadFileHandler; // 上传文件的钩子函数
  verifyContentHandler?: VerifyContentHandler = async () => true;
}

export type uploadFileHandler = (
  files: UploadAliyunFile[]
) => Promise<string> | void;
// 上传处理程序的约束

export class LocalChooseUploadHandler extends UploadHandler<LocalChooseUploadHandlerOption> {
  constructor(option: LocalChooseUploadHandlerOption) {
    super(optionHander(option, new LocalChooseUploadHandlerOption()));
  }

  async upload() {
    const self = this;
    const tempFiles = await selectFile();
    const files = transfromFileMeta(tempFiles);

    const uploadAliyunFiles = await transfromUploadAliyunFile(files);

    await this.option().uploadFileHandler(uploadAliyunFiles);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!(await this.option().verifyContentHandler(file))) {
        throw new VerifyFileException("content", file);
      }
    }

    return files;

    async function selectFile() {
      if (!wx.canIUse("chooseMessageFile")) {
        throw new CantUseApiException("chooseMessageFile");
      }

      const { tempFiles } = await wx.chooseMessageFile({
        count: self.option().count,
        type: self.option().type,
        extension: self.option().exts,
      });

      return tempFiles;
    }
    function transfromFileMeta(
      tempFiles: WechatMiniprogram.ChooseFile[] = []
    ): FileMeta[] {
      if (tempFiles.length > self.option().count) {
        throw new VerifyFileException("count", tempFiles);
      }
      return tempFiles.map((tempFile) => {
        if (tempFile.size > self.option().size) {
          throw new VerifyFileException("size", tempFile);
        }
        if (tempFile.type !== self.option().type) {
          throw new VerifyFileException("type", tempFile);
        }
        let ext = UrlParser.ext(tempFile.name);
        if (
          self.option().exts?.length &&
          !self.option().exts.includes(ext.toLowerCase())
        ) {
          throw new VerifyFileException("exts", tempFile);
        }
        return {
          size: tempFile.size,
          ext,
          name: tempFile.name,
          type: tempFile.type,
          path: tempFile.path,
          time: tempFile.time,
          urlPath: `${self.option().prefix}/${uuid()}.${ext}`,
        };
      });
    }
    function transfromUploadAliyunFile(files: FileMeta[]): UploadAliyunFile[] {
      const typeToCate = {
        all: "disk",
        video: "video",
        image: "img",
        file: "file",
      };
      const ossBucketMap = {
        record: "https://campusrecord.welife001.com",
        video: "https://campusvideo.welife001.com",
        img: "https://campus002.welife001.com",
        answer_img: "https://campus002.welife001.com",
        file: "https://campusfile.welife001.com",
        album: "https://album.welife001.com", //网盘相册
        disk: "https://disk.welife001.com", //网盘文件
      };

      return files.map((file) => {
        const cate = self.option().cate || typeToCate[file.type]; // 如果没有传入cate， 自动推算cate类型
        const url = ossBucketMap[cate] + file.urlPath;
        file.url = url;
        return {
          cate,
          url,
          file: file.path,
          new_name: file.urlPath.substr(1),
          size: file.size,
        };
      });
    }
  }

  about() {}

  destroy() {}
}

export class UploadAliyunFile {
  // TODO: 这是是 `utils/uploadoss/uploadAliyun.js` uploadFile 第一个参数的类型
  //       目前的临时解决方案，之后封装了API之后修改
  cate: Cate;
  file: string;
  new_name: string;
  size: number;
  duration?: number;
}

export class CantUseApiException extends Error {
  readonly name: string = "CantUseApiException";
  type: string;
  constructor(api: string) {
    super(`Cant use ${api} because doesn't support it.`);
    this.type = api;
  }
}

export class UploadFileException extends Error {
  readonly name: string = "ResponseStatusCodeException";
  type: string;
  result: WechatMiniprogram.UploadFileSuccessCallbackResult;
  constructor(res) {
    super(`http status ${res.statuCode} not 2xx.`);
    this.type = res.statuCode;
    this.result = res;
  }
}
