import { LocalChooseUploadHandler } from "./../../src/upload-handler/LocalChooseUploadHandler";
import { Uploader } from "../../src/core/Uploader";

function mockWx() {
  (globalThis as any).wx = {
    canIUse: jest.fn(() => true),
    chooseMessageFile: jest.fn(() => ({
      tempFiles: [
        {
          path: "/user/1.xlsx",
          size: 100,
          name: "1.xlsx",
          type: "file",
          time: "",
        },
      ],
    })),
    uploadFile: jest.fn(({ success }) => {
      success({ statusCode: "200" });
      return { about: jest.fn() };
    }),
  };
}
const uploadFileHandler = () => Promise.resolve("");

describe("LocalChooseUploadHandler.ts", () => {
  it("init WeappUploadHandler", () => {
    mockWx();
    const uploaderHandler = new LocalChooseUploadHandler({
      exts: [],
      type: "all",
      count: 1,
      uploadFileHandler,
    });
    expect(uploaderHandler.option()).toEqual({
      exts: [],
      type: "all",
      count: 1,
      size: 1024 * 1024 * 3,
      prefix: "",
      cate: undefined,
      uploadFileHandler,
    });
  });

  it("should trigger uploaded hook.", async () => {
    mockWx();
    const uploaderHandler = new Uploader(LocalChooseUploadHandler, {
      exts: [],
      type: "file",
      count: 1,
      uploadFileHandler: () => Promise.resolve(""),
    });
    const files = await uploaderHandler.upload().wait();

    expect(files[0].url).not.toBe("");
  });

  it.todo("other tests to weapp tools");
});
