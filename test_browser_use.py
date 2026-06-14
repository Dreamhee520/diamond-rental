#!/usr/bin/env python3
"""
测试 browser-use 是否正常工作
"""

import asyncio
from browser_use import Agent, Browser
from dotenv import load_dotenv

load_dotenv()


async def test_browser():
    """简单测试：打开浏览器并访问 Google"""
    print("正在测试 browser-use...")
    
    # 创建浏览器实例（headless 模式）
    browser = Browser(headless=True)
    
    try:
        # 创建 Agent
        agent = Agent(
            browser=browser,
            task="打开 https://www.google.com ，然后返回页面标题",
            max_steps=3,
        )
        
        # 运行任务
        result = await agent.run()
        
        print(f"✓ 测试成功！")
        print(f"结果: {result}")
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await browser.close()


if __name__ == "__main__":
    asyncio.run(test_browser())
