"""截图验证脚本：验证纯黑古地图效果"""
import subprocess
import sys
import time
import os

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright"])
    from playwright.sync_api import sync_playwright

SCREENSHOTS_DIR = "d:/work/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)


def click_text(page, text):
    loc = page.locator(f"button:has-text('{text}')")
    if loc.count() > 0:
        loc.first.click()
        return True
    return False


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append({"type": msg.type, "text": msg.text}))

        print("=== 1. 打开首页 ===")
        page.goto("http://localhost:3000", wait_until="networkidle", timeout=30000)
        time.sleep(3)
        page.screenshot(path=f"{SCREENSHOTS_DIR}/01-home.png")
        print(f"  截图: {SCREENSHOTS_DIR}/01-home.png")

        print("=== 2. 点击通史 ===")
        if click_text(page, "通史"):
            time.sleep(3)
            page.screenshot(path=f"{SCREENSHOTS_DIR}/02-general.png")
            print(f"  截图: {SCREENSHOTS_DIR}/02-general.png")

        print("=== 3. 切换到纯黑古图模式 ===")
        if click_text(page, "纯黑古图"):
            time.sleep(4)
            page.screenshot(path=f"{SCREENSHOTS_DIR}/03-black-ancient.png")
            print(f"  截图: {SCREENSHOTS_DIR}/03-black-ancient.png")

        print("=== 4. 点击时间轴唐朝位置 ===")
        timeline = page.locator(".timeline-panel")
        if timeline.count() > 0:
            box = timeline.bounding_box()
            if box:
                click_x = box["x"] + box["width"] * 0.6
                click_y = box["y"] + box["height"] * 0.5
                page.mouse.click(click_x, click_y)
                time.sleep(2)
                page.screenshot(path=f"{SCREENSHOTS_DIR}/04-black-tang.png")
                print(f"  截图: {SCREENSHOTS_DIR}/04-black-tang.png")

        print("=== 5. 断代史 -> 唐（纯黑古图） ===")
        if click_text(page, "断代史"):
            time.sleep(2)
            if click_text(page, "唐"):
                time.sleep(3)
                page.screenshot(path=f"{SCREENSHOTS_DIR}/05-black-dynasty-tang.png")
                print(f"  截图: {SCREENSHOTS_DIR}/05-black-dynasty-tang.png")

        print("=== 6. 控制台消息 ===")
        errors = [m for m in console_msgs if m["type"] == "error"]
        warnings = [m for m in console_msgs if m["type"] == "warning"]
        print(f"  总消息: {len(console_msgs)}")
        print(f"  错误: {len(errors)}")
        print(f"  警告: {len(warnings)}")
        for e in errors[:5]:
            print(f"  [ERROR] {e['text'][:150]}")
        for w in warnings[:3]:
            print(f"  [WARN] {w['text'][:150]}")

        browser.close()
        print("\n=== 截图完成 ===")
        print(f"所有截图保存在: {SCREENSHOTS_DIR}/")


if __name__ == "__main__":
    main()
