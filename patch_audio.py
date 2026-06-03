import glob, re

button_html = '''id="btnVolver">← Volver</a>
<button class="btn-mute" onclick="SFX.toggleMute()" style="position: absolute; top: 15px; right: 15px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-family: 'Space Mono', monospace; font-size: 0.7rem; transition: 0.2s; z-index: 100;">🔊 Sonido</button>'''

script_html = '<script src="../core/audio.js"></script>\n<script src="../core/cursor.js"></script>'

for file in glob.glob('simulators/*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'audio.js' not in content:
        content = re.sub(r'id="btnVolver">← Volver</a>', button_html, content)
        content = content.replace('<script src="../core/cursor.js"></script>', script_html)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
