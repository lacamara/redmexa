/**
 * @jest-environment jsdom
 */
import { addQueryStringParams } from "./url.js";

describe("URL utils", function () {
  describe("addQueryStringParams", function () {
    it("should return an empty string if argument url is falsy", function () {
      const args = [null, {}];
      const expected = "";
      const result = addQueryStringParams(...args);
      expect(result).toEqual(expected);
    });
    it("should return argument url if argument params is falsy", function () {
      const args = ["https://preprod.redmexa.com/", null];
      const expected = args[0];
      const result = addQueryStringParams(...args);
      expect(result).toEqual(expected);
    });
    it("should return argument url if argument params type is not 'object'", function () {
      const args = ["https://preprod.redmexa.com/", "not an object"];
      const expected = args[0];
      const result = addQueryStringParams(...args);
      expect(result).toEqual(expected);
    });
    it("should return argument url if argument params type has no properties", function () {
      const args = ["https://preprod.redmexa.com/", {}];
      const expected = args[0];
      const result = addQueryStringParams(...args);
      expect(result).toEqual(expected);
    });
    it("should add query string params to argument url if none are already present", function () {
      const args = ["https://preprod.redmexa.com/", { a: "a" }];
      const expected = "https://preprod.redmexa.com/?a=a";
      const result = addQueryStringParams(...args);
      expect(result).toEqual(expected);
    });
    it("should add query string params to argument url if some are present", function () {
      const args = ["https://preprod.redmexa.com/?a=a", { b: "b" }];
      const expected = "https://preprod.redmexa.com/?a=a&b=b";
      const result = addQueryStringParams(...args);
      expect(result).toEqual(expected);
    });
    it("should prefer arguent params values if they conflicts with argument url already present params", function () {
      const args = ["https://preprod.redmexa.com/?a=a", { a: "b" }];
      const expected = "https://preprod.redmexa.com/?a=b";
      const result = addQueryStringParams(...args);
      expect(result).toEqual(expected);
    });
  });
});
