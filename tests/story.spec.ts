import { test, expect } from "@playwright/test";
test("default story: wallpaper, passcode 1101 and WeChat chat with 猪儿", async ({
  page,
  request,
}) => {
  const work = await (await request.get("/work.json")).json();
  expect(work.id).toBe("dachshund-phone");
  expect(work.phone.wallpaper).toMatch(/^data:image\/jpeg;base64,/);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/");
  const screen = page.locator(".phone-screen");
  await expect(screen).toHaveClass(/wallpaper-custom/);
  await expect(screen).toHaveCSS("background-image", /^url\("data:image\/jpeg/);
  await page.getByRole("button", { name: "轻触解锁" }).click();
  for (const n of "0000")
    await page.getByRole("button", { name: "密码键" + n, exact: true }).click();
  await expect(page.locator(".lock-screen")).toHaveCount(1);
  for (const n of "1101")
    await page.getByRole("button", { name: "密码键" + n, exact: true }).click();
  await expect(page.locator(".lock-screen")).toHaveCount(0);
  await page.screenshot({ path: "outputs/story/home.png" });
  await page.getByRole("button", { name: "打开微信", exact: true }).click();
  const row = page.locator(".wx-chat-row").filter({ hasText: "猪儿" });
  await expect(row).toHaveCount(1);
  await row.click();
  await expect(page.locator(".wx-nav strong")).toHaveText("猪儿");
  const chat = page.locator(".skin-messages");
  await expect(chat).toContainText("腊肠狗臭臭笨笨坏坏坏！");
  await expect(chat).toContainText("加秒加秒！");
  await expect(chat).toContainText("nononono不许加秒啊啊啊啊啊啊气死我了");
  await page.screenshot({ path: "outputs/story/wechat.png" });
});
