#!/usr/bin/env python3
"""
使用 Playwright + 百度图片搜索下载角色头像
"""

import asyncio
from pathlib import Path

CHARACTERS = [
    ("水原千鹤", "租借女友"),
    ("七海麻美", "租借女友"),
    ("更科瑠夏", "租借女友"),
    ("樱泽墨", "租借女友"),
    ("绫野美咲", "知性御姐 动漫"),
    ("皐月凛", "高冷御姐 动漫"),
    ("渚ことみ", "清纯学妹 动漫"),
    ("玲奈", "元气辣妹 动漫"),
    ("雪菜", "冰雪美人 动漫"),
    ("遥", "运动少女 动漫"),
    ("琴音", "文艺少女 动漫"),
    ("芽衣", "甜美萝莉 动漫"),
]

OUTPUT_DIR = Path(r"C:\Users\26299\WorkBuddy\2026-06-12-22-48-03\diamond-rental\client\public\images\characters")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


async def download_one(page, idx: int, chinese_name: str, extra_kw: str) -> bool:
    """为单个角色下载图片（使用百度图片搜索）"""
    import urllib.parse
    import aiohttp
    
    query = f"{chinese_name} {extra_kw} 动漫头像"
    encoded = urllib.parse.quote(query)
    url = f"https://image.baidu.com/search/index?tn=baiduimage&word={encoded}"

    print(f"\n[{idx+1}/12] {chinese_name}")
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(4000)
    except Exception as e:
        print(f"  ❌ 导航失败: {e}")
        return False

    # 获取所有 data-objurl（原始图片 URL）
    objurls = await page.evaluate("""() => {
        const urls = [];
        document.querySelectorAll('[data-objurl]').forEach(el => {
            const url = el.getAttribute('data-objurl');
            if (url && url.startsWith('http') && !url.includes('douyinpic')) {
                urls.push(url);
            }
        });
        // 如果 douyinpic 的太多，也兜底加入
        if (urls.length < 2) {
            document.querySelectorAll('[data-objurl]').forEach(el => {
                const url = el.getAttribute('data-objurl');
                if (url && url.startsWith('http') && url.includes('douyinpic')) {
                    urls.push(url);
                }
            });
        }
        return urls.slice(0, 6);
    }""")

    if not objurls:
        print(f"  ❌ 未找到图片 URL")
        return False

    print(f"  找到 {len(objurls)} 个候选")

    # 逐个尝试下载
    async with aiohttp.ClientSession() as sess:
        for j, img_url in enumerate(objurls):
            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "https://image.baidu.com/",
                }
                async with sess.get(img_url, timeout=30, headers=headers) as resp:
                    if resp.status == 200:
                        content = await resp.read()
                        if len(content) > 15000:  # 至少 15KB
                            ext = "jpg"
                            ct = resp.content_type or ""
                            if "png" in ct:
                                ext = "png"
                            elif "webp" in ct:
                                ext = "webp"

                            filename = f"{idx+1:02d}_{chinese_name}.{ext}"
                            filepath = OUTPUT_DIR / filename

                            # 覆盖写入
                            with open(filepath, "wb") as f:
                                f.write(content)
                            print(f"  ✓ 已保存: {filename} ({len(content)//1024}KB)")
                            return True
                        else:
                            print(f"    第{j+1}张太小 ({len(content)} bytes)")
                    else:
                        print(f"    第{j+1}张 HTTP {resp.status}")
            except Exception as e:
                print(f"    第{j+1}张失败: {e}")

    print(f"  ❌ 所有候选均下载失败")
    return False


async def main():
    from playwright.async_api import async_playwright

    print("=" * 60)
    print("Diamond 租借女友 - 角色图片下载 (百度)")
    print("=" * 60)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            locale="zh-CN",
        )
        page = await ctx.new_page()

        success = 0
        failed = []

        for i, (cn, kw) in enumerate(CHARACTERS):
            ok = await download_one(page, i, cn, kw)
            if ok:
                success += 1
            else:
                failed.append(cn)
            if i < len(CHARACTERS) - 1:
                await asyncio.sleep(2)

        await browser.close()

    print(f"\n{'='*60}")
    print(f"完成！成功: {success}/12")
    if failed:
        print(f"失败: {', '.join(failed)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    asyncio.run(main())
