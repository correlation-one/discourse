import { acceptance } from "helpers/qunit-helpers";

acceptance("DiscourseCorrelationOnePackage", { loggedIn: true });

test("DiscourseCorrelationOnePackage works", async assert => {
  await visit("/admin/plugins/discourse-correlation-one-package");

  assert.ok(false, "it shows the DiscourseCorrelationOnePackage button");
});
