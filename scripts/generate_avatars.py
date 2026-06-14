#!/usr/bin/env python3
"""Generate SVG anime-style character portrait avatars for Diamond Rental."""

import os

OUTPUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "client", "public", "images", "characters"
)

CHARACTERS = [
    # Original 4 anime characters
    {
        "id": "chizuru_avatar",
        "name": "水原千鹤",
        "hair": "#3D1C02", "hair_dark": "#2A1301",
        "skin": "#FDE8D6", "skin_shadow": "#E8C9A8",
        "eyes": "#8B6914", "eye_highlight": "#D4A832",
        "top": "#F0E6D8", "top_dark": "#D8C8B0",
        "ribbon": "#C41E3A",
        "bg": "linear-gradient(135deg, #F5E6E0 0%, #E8D0C0 100%)",
        "expression": "gentle"
    },
    {
        "id": "mami_avatar",
        "name": "七海麻美",
        "hair": "#F5DEB3", "hair_dark": "#DEB887",
        "skin": "#FFF5EE", "skin_shadow": "#F0DDD0",
        "eyes": "#CD853F", "eye_highlight": "#F4A460",
        "top": "#FFF8DC", "top_dark": "#F0E0B0",
        "bow": "#FF69B4",
        "bg": "linear-gradient(135deg, #FFF8F0 0%, #FFE8D0 100%)",
        "expression": "sweet"
    },
    {
        "id": "ruka_avatar",
        "name": "更科瑠夏",
        "hair": "#FFB6C1", "hair_dark": "#F090A0",
        "skin": "#FFEEDD", "skin_shadow": "#F0C8A8",
        "eyes": "#FF69B4", "eye_highlight": "#FFB6C1",
        "top": "#FFE0E8", "top_dark": "#F5C0D0",
        "ribbon": "#FF4500",
        "bg": "linear-gradient(135deg, #FFF0E8 0%, #FFD8C0 100%)",
        "expression": "cheerful"
    },
    {
        "id": "sumi_avatar",
        "name": "樱泽墨",
        "hair": "#FFD1DC", "hair_dark": "#F0B0C0",
        "skin": "#FFF8F0", "skin_shadow": "#F0E0D0",
        "eyes": "#C08081", "eye_highlight": "#FFB6C1",
        "top": "#FFF0F5", "top_dark": "#F0D8E0",
        "flower": "#FF1493",
        "bg": "linear-gradient(135deg, #FFF5F8 0%, #FDE0E8 100%)",
        "expression": "shy"
    },
    {
        "id": "ayano_avatar",
        "name": "绫野美咲",
        "hair": "#5B3A8C", "hair_dark": "#3A1F5E",
        "skin": "#FDE8D6", "skin_shadow": "#E8C9A8",
        "eyes": "#7B4FA2", "eye_highlight": "#B88ADE",
        "top": "#D4A8E8", "top_dark": "#B07CC6",
        "bow": "#FF6B8A",
        "bg": "linear-gradient(135deg, #E8D5F5 0%, #D4A8E8 100%)",
        "expression": "gentle"
    },
    {
        "id": "satsuki_avatar",
        "name": "皐月凛",
        "hair": "#2C1810", "hair_dark": "#1A0E08",
        "skin": "#FEF0E0", "skin_shadow": "#E8D0B8",
        "eyes": "#8B4513", "eye_highlight": "#CD853F",
        "top": "#E8E8E8", "top_dark": "#C0C0C0",
        "tie": "#C41E3A",
        "bg": "linear-gradient(135deg, #F5E6E0 0%, #E8D0C0 100%)",
        "expression": "cool"
    },
    {
        "id": "nagisa_avatar",
        "name": "渚ことみ",
        "hair": "#87CEEB", "hair_dark": "#5BA8D0",
        "skin": "#FFF5EE", "skin_shadow": "#F0DDD0",
        "eyes": "#4682B4", "eye_highlight": "#87CEFA",
        "top": "#B0E0E6", "top_dark": "#8BC4D6",
        "ribbon": "#FFD700",
        "bg": "linear-gradient(135deg, #E0F0F8 0%, #B0D8E8 100%)",
        "expression": "shy"
    },
    {
        "id": "rena_avatar",
        "name": "玲奈",
        "hair": "#FF7F50", "hair_dark": "#E06030",
        "skin": "#FFEEDD", "skin_shadow": "#F0C8A8",
        "eyes": "#FF6347", "eye_highlight": "#FFA07A",
        "top": "#FFDAB9", "top_dark": "#F5C0A0",
        "flower": "#FF1493",
        "bg": "linear-gradient(135deg, #FFF0E8 0%, #FFD8C0 100%)",
        "expression": "cheerful"
    },
    {
        "id": "yukina_avatar",
        "name": "雪菜",
        "hair": "#F0F0F0", "hair_dark": "#D0D0D0",
        "skin": "#FFF8F0", "skin_shadow": "#F0E0D0",
        "eyes": "#6495ED", "eye_highlight": "#B0C4DE",
        "top": "#FFFFFF", "top_dark": "#E8E8F0",
        "scarf": "#98D8C8",
        "bg": "linear-gradient(135deg, #F5F5FF 0%, #E0E0F0 100%)",
        "expression": "serene"
    },
    {
        "id": "haruka_avatar",
        "name": "遥",
        "hair": "#228B22", "hair_dark": "#166B16",
        "skin": "#FFF0E5", "skin_shadow": "#F0D0B8",
        "eyes": "#2E8B57", "eye_highlight": "#66CDAA",
        "top": "#98FB98", "top_dark": "#7ADD7A",
        "ribbon": "#FF69B4",
        "bg": "linear-gradient(135deg, #E8F5E8 0%, #C8E6C0 100%)",
        "expression": "warm"
    },
    {
        "id": "kotone_avatar",
        "name": "琴音",
        "hair": "#9370DB", "hair_dark": "#7B5DB0",
        "skin": "#FFEFE0", "skin_shadow": "#F0D0B0",
        "eyes": "#8A2BE2", "eye_highlight": "#BA55D3",
        "top": "#E6E6FA", "top_dark": "#D0C8E8",
        "choker": "#FF69B4",
        "bg": "linear-gradient(135deg, #F0E8F8 0%, #D0C0E8 100%)",
        "expression": "mysterious"
    },
    {
        "id": "mei_avatar",
        "name": "芽衣",
        "hair": "#FFB6C1", "hair_dark": "#F0A0B0",
        "skin": "#FFF5F0", "skin_shadow": "#F0D8C8",
        "eyes": "#DB7093", "eye_highlight": "#FFB6C1",
        "top": "#FFC0CB", "top_dark": "#F5A0B0",
        "bow": "#FF1493",
        "bg": "linear-gradient(135deg, #FFF0F5 0%, #FFE0E8 100%)",
        "expression": "sweet"
    },
]

def make_svg(char):
    hair = char["hair"]
    hair_dark = char["hair_dark"]
    skin = char["skin"]
    skin_shadow = char["skin_shadow"]
    eyes = char["eyes"]
    eye_h = char["eye_highlight"]
    bg = char["bg"]
    
    # Determine bangs style based on character
    bangs_variation = """<ellipse cx="200" cy="110" rx="80" ry="45" fill="{hair}"/>
    <ellipse cx="140" cy="100" rx="50" ry="55" fill="{hair}"/>
    <ellipse cx="260" cy="100" rx="50" ry="55" fill="{hair}"/>
    <ellipse cx="100" cy="120" rx="45" ry="50" fill="{hair}"/>
    <ellipse cx="300" cy="120" rx="45" ry="50" fill="{hair}"/>""".format(hair=hair)
    
    # Side hair
    side_hair_l = '<ellipse cx="70" cy="200" rx="45" ry="100" fill="{hair}"/>'.format(hair=hair)
    side_hair_r = '<ellipse cx="330" cy="200" rx="45" ry="100" fill="{hair}"/>'.format(hair=hair)
    
    # Make eyes based on expression
    eye_sparkle = """<circle cx="170" cy="195" r="5" fill="#FFFFFF"/>
    <circle cx="230" cy="195" r="5" fill="#FFFFFF"/>"""
    
    if char["expression"] == "cheerful":
        eye_shape = """<path d="M 155 200 Q 175 185 195 200 Q 175 195 155 200" fill="{eyes}" stroke="{eye_h}" stroke-width="1.5"/>
        <path d="M 205 200 Q 225 185 245 200 Q 225 195 205 200" fill="{eyes}" stroke="{eye_h}" stroke-width="1.5"/>"""
    elif char["expression"] == "shy":
        eye_shape = """<ellipse cx="175" cy="200" rx="18" ry="10" fill="{eyes}"/>
        <ellipse cx="225" cy="200" rx="18" ry="10" fill="{eyes}"/>"""
    elif char["expression"] == "cool":
        eye_shape = """<ellipse cx="175" cy="200" rx="20" ry="8" fill="{eyes}"/>
        <ellipse cx="225" cy="200" rx="20" ry="8" fill="{eyes}"/>"""
    elif char["expression"] == "serene":
        eye_shape = """<path d="M 155 200 Q 175 195 195 200 Q 175 198 155 200" fill="{eyes}"/>
        <path d="M 205 200 Q 225 195 245 200 Q 225 198 205 200" fill="{eyes}"/>"""
    elif char["expression"] == "mysterious":
        eye_shape = """<ellipse cx="175" cy="200" rx="18" ry="12" fill="{eyes}"/>
        <ellipse cx="225" cy="200" rx="18" ry="12" fill="{eyes}"/>"""
    elif char["expression"] == "sweet":
        eye_shape = """<circle cx="175" cy="200" r="15" fill="{eyes}"/>
        <circle cx="225" cy="200" r="15" fill="{eyes}"/>"""
    else:  # gentle, warm
        eye_shape = """<ellipse cx="175" cy="200" rx="18" ry="14" fill="{eyes}"/>
        <ellipse cx="225" cy="200" rx="18" ry="14" fill="{eyes}"/>"""
    
    eye_pupil = """<ellipse cx="175" cy="200" rx="9" ry="11" fill="#1a1a2e"/>
    <ellipse cx="225" cy="200" rx="9" ry="11" fill="#1a1a2e"/>"""
    
    # Blush
    blush = """<ellipse cx="145" cy="215" rx="18" ry="10" fill="#FFB6C1" opacity="0.4"/>
    <ellipse cx="255" cy="215" rx="18" ry="10" fill="#FFB6C1" opacity="0.4"/>"""

    # Simple smile
    smile = '<path d="M 185 230 Q 200 248 215 230" stroke="#C47A7A" stroke-width="2" fill="none" stroke-linecap="round"/>'
    
    # Nose
    nose = '<path d="M 198 212 Q 200 218 202 212" stroke="#D4A88" fill="none" stroke-width="1.2"/>'

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" style="stop-color:{skin};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:{skin_shadow};stop-opacity:0.15"/>
    </radialGradient>
    <filter id="softShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2"/>
      <feComposite in2="SourceGraphic" operator="over"/>
    </filter>
  </defs>

  <!-- Background circle -->
  <rect width="400" height="400" rx="200" fill="#f8f4ff"/>
  <circle cx="200" cy="200" r="180" fill="url(#bgGrad)"/>

  <!-- Body/shoulders -->
  <ellipse cx="200" cy="340" rx="120" ry="80" fill="{char['top']}"/>
  <ellipse cx="200" cy="350" rx="100" ry="60" fill="{char['top_dark']}"/>
  <path d="M 80 300 Q 80 380 200 400 Q 320 380 320 300" fill="{char['top']}"/>

  <!-- Neck -->
  <rect x="185" y="240" width="30" height="40" rx="8" fill="{skin}"/>
  <rect x="185" y="245" width="30" height="10" rx="4" fill="{skin_shadow}" opacity="0.3"/>

  <!-- Head -->
  <ellipse cx="200" cy="180" rx="80" ry="95" fill="{skin}"/>
  <ellipse cx="200" cy="250" rx="85" ry="30" fill="{skin_shadow}" opacity="0.15"/>

  <!-- Back hair (behind face) -->
  <ellipse cx="200" cy="175" rx="90" ry="100" fill="{hair_dark}"/>
  <ellipse cx="200" cy="300" rx="95" ry="120" fill="{hair_dark}"/>

  <!-- Side hair strands -->
  {side_hair_l}
  {side_hair_r}

  <!-- Forehead highlight -->
  <ellipse cx="200" cy="155" rx="40" ry="8" fill="#FFFFFF" opacity="0.15"/>

  <!-- Eyebrows -->
  <path d="M 155 178 Q 175 172 195 178" stroke="{hair_dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 205 178 Q 225 172 245 178" stroke="{hair_dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Eyes -->
  {eye_shape.format(eyes=eyes, eye_h=eye_h)}
  {eye_pupil}
  {eye_sparkle}

  <!-- Eyelashes -->
  <path d="M 155 195 Q 150 190 148 185" stroke="{hair_dark}" stroke-width="1.5" fill="none"/>
  <path d="M 245 195 Q 250 190 252 185" stroke="{hair_dark}" stroke-width="1.5" fill="none"/>

  <!-- Eye highlights -->
  <circle cx="172" cy="196" r="4" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="222" cy="196" r="4" fill="#FFFFFF" opacity="0.8"/>

  <!-- Blush -->
  {blush}

  <!-- Nose -->
  {nose}

  <!-- Mouth/Smile -->
  {smile}

  <!-- Front bangs -->
  {bangs_variation}

  <!-- Hair top highlight -->
  <ellipse cx="200" cy="80" rx="50" ry="15" fill="#FFFFFF" opacity="0.1"/>
  <ellipse cx="170" cy="90" rx="15" ry="25" fill="#FFFFFF" opacity="0.08"/>
  <ellipse cx="230" cy="90" rx="15" ry="25" fill="#FFFFFF" opacity="0.08"/>

  <!-- Sparkle decorations -->
  <circle cx="60" cy="80" r="3" fill="{hair}" opacity="0.3"/>
  <circle cx="340" cy="60" r="2" fill="{hair}" opacity="0.3"/>
  <circle cx="50" cy="180" r="2" fill="{hair}" opacity="0.2"/>
  <circle cx="350" cy="170" r="3" fill="{hair}" opacity="0.2"/>
  <circle cx="80" cy="280" r="2" fill="{hair}" opacity="0.15"/>
  <circle cx="320" cy="290" r="2.5" fill="{hair}" opacity="0.15"/>

  <!-- Decorative small sparkles -->
  <path d="M 60 80 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 z" fill="{hair}" opacity="0.4"/>
  <path d="M 340 60 l 1.5 -4 l 1.5 4 l 4 1.5 l -4 1.5 l -1.5 4 l -1.5 -4 l -4 -1.5 z" fill="{hair}" opacity="0.4"/>
</svg>'''
    return svg


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for char in CHARACTERS:
        svg = make_svg(char)
        filepath = os.path.join(OUTPUT_DIR, f"{char['id']}.svg")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(svg)
        print(f"Created: {filepath}")
    print(f"\nDone! Generated {len(CHARACTERS)} character avatars.")


if __name__ == "__main__":
    main()
