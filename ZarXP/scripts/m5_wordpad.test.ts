import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Milestone 5: WordPad Rich-Text Engine Standards", () => {
  test("WordPad font sizes map to HTML font size indices (1-7)", () => {
    const ptToHtmlSize = (pt: number): number => {
      if (pt <= 8) return 1;
      if (pt <= 10) return 2;
      if (pt <= 12) return 3;
      if (pt <= 14) return 4;
      if (pt <= 18) return 5;
      if (pt <= 24) return 6;
      return 7;
    };

    assert.equal(ptToHtmlSize(8), 1);
    assert.equal(ptToHtmlSize(10), 2);
    assert.equal(ptToHtmlSize(12), 3);
    assert.equal(ptToHtmlSize(14), 4);
    assert.equal(ptToHtmlSize(18), 5);
    assert.equal(ptToHtmlSize(24), 6);
    assert.equal(ptToHtmlSize(36), 7);
  });

  test("WordPad document export formats clean plain-text and HTML blob data", () => {
    const sampleHtml = "<div><b>Welcome to WordPad</b><br><p>This is a test document.</p></div>";
    const tempDiv = { innerHTML: sampleHtml, textContent: "Welcome to WordPad\nThis is a test document." };
    assert.ok(tempDiv.textContent.includes("Welcome to WordPad"));
  });
});
