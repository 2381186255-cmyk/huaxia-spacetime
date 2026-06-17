"""华夏时空全面功能审核"""
from playwright.sync_api import sync_playwright
import os, json

SHOT = os.path.join(os.path.dirname(__file__), "..", "audit-shots")
os.makedirs(SHOT, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=[
            "--use-gl=angle",
            "--use-angle=swiftshader",
            "--enable-webgl",
            "--ignore-gpu-blocklist",
            "--disable-gpu-sandbox",
            "--enable-features=SwiftShaderForWebGL",
        ]
    )
    page = browser.new_page(viewport={"width": 1280, "height": 720})

    # 沙箱：对外部图片/瓦片返回透明占位图，避免 abort 触发 MapLibre 报错浮层
    transparent_png = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAABFUlEQVR4nO3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6AwBPAABo9vSmwAAAABJRU5ErkJggg=="
    def stub_image(route):
        route.fulfill(
            status=200,
            content_type="image/png",
            body=__import__("base64").b64decode(transparent_png)
        )
    page.route("**/*.{png,jpg,jpeg,gif,webp,svg}", stub_image)
    page.route("https://gis.sinica.edu.tw/**", stub_image)
    page.route("https://*.basemaps.cartocdn.com/**", stub_image)

    console_msgs = []
    page.on("console", lambda msg: console_msgs.append({"type": msg.type, "text": msg.text}))

    results = {}

    def shot(name):
        page.screenshot(path=os.path.join(SHOT, f"{name}.png"))

    def click_text(text):
        btn = page.locator(f"button:has-text('{text}')")
        if btn.count() > 0:
            btn.first.click()
            return True
        return False

    # ===== 1. 首页加载 =====
    print("=== 1. 首页加载 ===")
    page.goto("http://localhost:3000", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_timeout(5000)
    shot("01-home")
    results["home"] = "loaded"

    # 检查Header
    header = page.locator("header, [class*='header']")
    results["header_visible"] = header.count() > 0

    # 检查搜索按钮
    search_btn = page.locator("button:has-text('搜索')")
    if search_btn.count() > 0:
        search_text = search_btn.first.inner_text()
        results["search_shortcut"] = search_text
        print(f"  搜索按钮: {search_text}")

    # ===== 2. 今日历史模式 =====
    print("=== 2. 今日历史 ===")
    shot("02-today-default")
    page.wait_for_timeout(2000)

    # ===== 3. 通史模式 =====
    print("=== 3. 通史模式 ===")
    if click_text("通史"):
        page.wait_for_timeout(3000)
        shot("03-general")
        results["general_mode"] = "loaded"

        # 检查时间轴
        timeline = page.locator(".timeline-panel")
        results["timeline_visible"] = timeline.count() > 0
        print(f"  时间轴: {'存在' if timeline.count() > 0 else '未找到'}")

        # 检查地图canvas
        map_canvas = page.locator("canvas")
        results["map_canvas"] = map_canvas.count() > 0
        print(f"  地图canvas: {'存在' if map_canvas.count() > 0 else '未找到'}")

        # 检查播放按钮
        play_btn = page.locator("button:has-text('播放'), [class*='play']")
        if play_btn.count() > 0:
            results["play_button"] = "exists"
            play_btn.first.click()
            page.wait_for_timeout(3000)
            shot("03b-general-playing")
            pause_btn = page.locator("button:has-text('暂停'), [class*='pause']")
            if pause_btn.count() > 0:
                pause_btn.first.click()
            else:
                play_btn.first.click()
            page.wait_for_timeout(1000)
            print("  播放测试完成")
    else:
        results["general_mode"] = "button not found"
        print("  未找到通史按钮")

    # ===== 4. 断代史模式 =====
    print("=== 4. 断代史模式 ===")
    if click_text("断代史"):
        page.wait_for_timeout(2000)
        shot("04-dynasty-list")
        results["dynasty_mode"] = "loaded"

        tang = page.locator("text=唐").first
        if tang:
            tang.click()
            page.wait_for_timeout(3000)
            shot("04b-dynasty-tang")
            results["dynasty_tang"] = "loaded"
            print("  唐朝详情加载完成")

            persons = page.locator("[class*='person'], [class*='人物']")
            results["persons_list"] = persons.count() > 0

            events = page.locator("[class*='event'], [class*='事件']")
            results["events_list"] = events.count() > 0
    else:
        results["dynasty_mode"] = "button not found"

    # ===== 5. 事件模式 =====
    print("=== 5. 事件模式 ===")
    if click_text("事件"):
        page.wait_for_timeout(2000)
        shot("05-event-list")
        results["event_mode"] = "loaded"

        event_card = page.locator("button:has-text('启征有扈')")
        if event_card.count() > 0:
            event_card.first.click()
            page.wait_for_timeout(3000)
            shot("05b-event-detail")
            results["event_detail"] = "loaded"
            print("  事件详情加载完成")

            map_area = page.locator(".maplibregl-map, [class*='map']")
            results["event_map_area"] = map_area.count() > 0
        else:
            cards = page.locator("[class*='grid'] button, [class*='event'] button")
            if cards.count() > 0:
                cards.first.click()
                page.wait_for_timeout(3000)
                shot("05b-event-detail-alt")
                results["event_detail"] = "loaded (alt)"
    else:
        results["event_mode"] = "button not found"

    # ===== 6. 古地图底图切换 =====
    print("=== 6. 底图切换 ===")
    if click_text("通史"):
        page.wait_for_timeout(2000)

        ancient = page.locator("button:has-text('古地图')")
        if ancient.count() > 0:
            ancient.first.click()
            page.wait_for_timeout(5000)
            shot("06-ancient-basemap")
            results["ancient_basemap"] = "tested"
            print("  古地图底图测试完成")

            modern = page.locator("button:has-text('现代')")
            if modern.count() > 0:
                modern.first.click()
                page.wait_for_timeout(2000)

            overlay = page.locator("button:has-text('叠加')")
            if overlay.count() > 0:
                overlay.first.click()
                page.wait_for_timeout(3000)
                shot("06b-overlay-basemap")
                results["overlay_basemap"] = "tested"
                print("  叠加底图测试完成")

    # ===== 7. 图层切换 =====
    print("=== 7. 图层切换 ===")
    territory_btn = page.locator("button:has-text('疆域')")
    if territory_btn.count() > 0:
        territory_btn.first.click()
        page.wait_for_timeout(2000)
        shot("07-territory-toggle")
        results["territory_toggle"] = "tested"
        print("  疆域图层切换测试完成")

    # ===== 8. 时间轴拖动测试 =====
    print("=== 8. 时间轴交互 ===")
    timeline_panel = page.locator(".timeline-panel svg")
    if timeline_panel.count() > 0:
        box = timeline_panel.first.bounding_box()
        if box:
            page.mouse.click(box["x"] + 50, box["y"] + box["height"] / 2)
            page.wait_for_timeout(2000)
            shot("08a-timeline-ancient")

            page.mouse.click(box["x"] + box["width"] - 50, box["y"] + box["height"] / 2)
            page.wait_for_timeout(2000)
            shot("08b-timeline-modern")
            results["timeline_drag"] = "tested"
            print("  时间轴点击测试完成")

    # ===== 9. 控制台错误汇总 =====
    print("\n=== 9. 控制台错误汇总 ===")
    errors = [m for m in console_msgs if m["type"] == "error"]

    territory_errors = [e for e in errors if "filter" in e["text"].lower() and "territory" in e["text"].lower()]
    ccts_errors = [e for e in errors if "ccts" in e["text"].lower() or "ERR_NAME" in e["text"]]
    sandbox_errors = [e for e in errors if "Failed to fetch" in e["text"] or "ERR_ABORTED" in e["text"] or "AJAXError" in e["text"]]
    other_errors = [e for e in errors if e not in territory_errors and e not in ccts_errors and e not in sandbox_errors]

    results["total_errors"] = len(errors)
    results["territory_filter_errors"] = len(territory_errors)
    results["ccts_errors"] = len(ccts_errors)
    results["sandbox_errors"] = len(sandbox_errors)
    results["other_errors"] = len(other_errors)

    print(f"  总错误数: {len(errors)}")
    print(f"  疆域filter错误: {len(territory_errors)}")
    print(f"  CCTS/DNS错误: {len(ccts_errors)}")
    print(f"  沙箱拦截错误(可忽略): {len(sandbox_errors)}")
    print(f"  其他错误: {len(other_errors)}")
    for e in other_errors[:5]:
        print(f"    - {e['text'][:120]}")

    # ===== 10. 最终结论 =====
    print("\n" + "="*60)
    print("全面审核结论:")
    print(f"  首页加载: {'✅' if results.get('home') == 'loaded' else '❌'}")
    print(f"  Header显示: {'✅' if results.get('header_visible') else '❌'}")
    print(f"  搜索快捷键: {results.get('search_shortcut', '未检测')}")
    print(f"  通史模式: {'✅' if results.get('general_mode') == 'loaded' else '❌'}")
    print(f"  时间轴: {'✅' if results.get('timeline_visible') else '❌'}")
    print(f"  地图Canvas: {'✅' if results.get('map_canvas') else '❌'}")
    print(f"  播放功能: {'✅' if results.get('play_button') == 'exists' else '❌'}")
    print(f"  断代史模式: {'✅' if results.get('dynasty_mode') == 'loaded' else '❌'}")
    print(f"  朝代详情: {'✅' if 'loaded' in str(results.get('dynasty_tang', '')) else '❌'}")
    print(f"  事件模式: {'✅' if results.get('event_mode') == 'loaded' else '❌'}")
    print(f"  事件详情: {'✅' if 'loaded' in str(results.get('event_detail', '')) else '❌'}")
    print(f"  古地图底图: {'✅' if results.get('ancient_basemap') == 'tested' else '❌'}")
    print(f"  叠加底图: {'✅' if results.get('overlay_basemap') == 'tested' else '❌'}")
    print(f"  疆域图层: {'✅' if results.get('territory_toggle') == 'tested' else '❌'}")
    print(f"  时间轴交互: {'✅' if results.get('timeline_drag') == 'tested' else '❌'}")
    print(f"  疆域filter错误: {'✅ 已修复' if len(territory_errors) == 0 else '❌ 仍存在'}")
    print(f"  总控制台错误: {len(errors)}")
    print("="*60)

    with open(os.path.join(SHOT, "audit-results.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    browser.close()
