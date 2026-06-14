#!/usr/bin/env python3
"""
使用 browser-use 下载 Diamond 租借女友角色图片
为每个角色搜索并下载动漫风格的头像图片
"""

import asyncio
import json
import os
from pathlib import Path

# 角色列表（中文名 + 日文名）
CHARACTERS = [
    {"id": 1, "name": "水原千鹤", "name_jp": "水原千鶴", "keywords": "anime girl black hair gentle"},
    {"id": 2, "name": "七海麻美", "name_jp": "七海麻美", "keywords": "anime girl blonde hair cheerful"},
    {"id": 3, "name": "更科瑠夏", "name_jp": "更科瑠夏", "keywords": "anime girl short hair energetic"},
    {"id": 4, "name": "樱泽墨", "name_jp": "桜沢墨", "keywords": "anime girl shy purple hair"},
    {"id": 5, "name": "绫野美咲", "name_jp": "綾野美咲", "keywords": "anime girl mature brown hair"},
    {"id": 6, "name": "皐月凛", "name_jp": "皐月凛", "keywords": "anime girl cool long silver hair"},
    {"id": 7, "name": "渚ことみ", "name_jp": "渚ことみ", "keywords": "anime girl cute pink hair"},
    {"id": 8, "name": "玲奈", "name_jp": "玲奈", "keywords": "anime girl sporty orange hair"},
    {"id": 9, "name": "雪菜", "name_jp": "雪菜", "keywords": "anime girl elegant white hair"},
    {"id": 10, "name": "遥", "name_jp": "遥", "keywords": "anime girl athletic black hair"},
    {"id": 11, "name": "琴音", "name_jp": "琴音", "keywords": "anime girl artistic blue hair"},
    {"id": 12, "name": "芽衣", "name_jp": "芽衣", "keywords": "anime girl lovely chestnut hair"},
]

OUTPUT_DIR = Path(__file__).parent / "client" / "public" / "images" / "characters"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


async def download_image_for_character(character: dict, browser_use) -> bool:
    """为单个角色下载图片"""
    print(f"\n{'='*50}")
    print(f"正在为 {character['name']} ({character['name_jp']}) 搜索图片...")
    print(f"{'='*50}")
    
    try:
        # 使用 Agent 来执行搜索和下载任务
        agent = browser_use.Agent(
            task=f"""
            1. 打开 https://www.google.com/imghp?hl=en
            2. 在搜索框中输入: {character['name_jp']} {character['keywords']} anime style portrait
            3. 点击搜索按钮
            4. 等待图片加载完成
            5. 点击第一张图片（缩略图）以查看大图
            6. 等待大图加载完成
            7. 获取大图的 URL（右键点击图片 -> 复制图片地址，或使用 JavaScript 获取 src）
            8. 返回图片的 URL
            """,
            max_steps=20,
            use_vision=True,
        )
        
        result = await agent.run()
        
        # 从结果中提取图片 URL
        image_url = None
        if isinstance(result, dict) and 'output' in result:
            # 尝试从输出中提取 URL
            import re
            urls = re.findall(r'https?://[^\s<>"]+?\.(?:jpg|jpeg|png|webp)', str(result['output']))
            if urls:
                image_url = urls[0]
        
        if not image_url:
            print(f"  ❌ 未能获取 {character['name']} 的图片 URL")
            return False
        
        print(f"  ✓ 找到图片 URL: {image_url[:80]}...")
        
        # 下载图片
        import aiohttp
        
        output_path = OUTPUT_DIR / f"{character['id']:02d}_{character['name']}.jpg"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(image_url, timeout=30) as resp:
                if resp.status == 200:
                    with open(output_path, 'wb') as f:
                        f.write(await resp.read())
                    print(f"  ✓ 已保存到: {output_path}")
                    return True
                else:
                    print(f"  ❌ 下载失败，HTTP 状态码: {resp.status}")
                    return False
                    
    except Exception as e:
        print(f"  ❌ 处理 {character['name']} 时出错: {e}")
        return False


async def main():
    """主函数"""
    print("=" * 60)
    print("Diamond 租借女友 - 角色图片下载工具")
    print("使用 browser-use 自动搜索并下载角色图片")
    print("=" * 60)
    
    # 检查 browser-use 是否可用
    try:
        import browser_use
        print(f"\n✓ browser-use 已安装")
    except ImportError:
        print("\n❌ browser-use 未安装，请先运行: pip install 'browser-use[core]'")
        return
    
    # 检查 aiohttp 是否可用
    try:
        import aiohttp
    except ImportError:
        print("\n⚠ aiohttp 未安装，正在安装...")
        import subprocess
        subprocess.run([sys.executable, "-m", "pip", "install", "aiohttp"], check=True)
        import aiohttp
    
    # 为每个角色下载图片
    success_count = 0
    failed_characters = []
    
    for i, character in enumerate(CHARACTERS, 1):
        print(f"\n进度: {i}/{len(CHARACTERS)}")
        
        success = await download_image_for_character(character, browser_use)
        
        if success:
            success_count += 1
        else:
            failed_characters.append(character['name'])
        
        # 每次下载后等待几秒，避免被封 IP
        if i < len(CHARACTERS):
            wait_time = 3
            print(f"  等待 {wait_time} 秒后继续...")
            await asyncio.sleep(wait_time)
    
    # 输出总结
    print("\n" + "=" * 60)
    print("下载完成！")
    print(f"成功: {success_count}/{len(CHARACTERS)}")
    
    if failed_characters:
        print(f"失败的角色: {', '.join(failed_characters)}")
    
    print("=" * 60)


if __name__ == "__main__":
    # 需要在 asyncio 事件循环中运行
    asyncio.run(main())
