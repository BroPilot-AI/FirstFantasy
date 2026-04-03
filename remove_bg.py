import sys
import collections

try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def remove_bg(img_path):
    print(f"Processing {img_path}")
    img = Image.open(img_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    
    bg_colors = []
    for x in range(32):
        for y in range(32):
            if x < width and y < height:
                p = pixels[x, y]
                if abs(p[0] - p[1]) < 10 and abs(p[1] - p[2]) < 10:
                    exists = False
                    for b in bg_colors:
                        if abs(b[0] - p[0]) < 10:
                            exists = True
                            break
                    if not exists:
                        bg_colors.append(p)
                        
    print("Found BG colors:", bg_colors)
    
    visited = set()
    queue = collections.deque()
    for i in range(width):
        queue.append((i, 0))
        queue.append((i, height - 1))
    for j in range(height):
        queue.append((0, j))
        queue.append((width - 1, j))
        
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        
        p = pixels[x, y]
        if p[3] == 0:
            continue
            
        is_bg = False
        for b in bg_colors:
            if abs(p[0] - b[0]) < 20 and abs(p[1] - b[1]) < 20 and abs(p[2] - b[2]) < 20:
                is_bg = True
                break
                
        if is_bg:
            pixels[x, y] = (0, 0, 0, 0)
            if x > 0: queue.append((x - 1, y))
            if x < width - 1: queue.append((x + 1, y))
            if y > 0: queue.append((x, y - 1))
            if y < height - 1: queue.append((x, y + 1))
            
    img.save(img_path)

remove_bg('assets/cyber_building_1775236601593.png')
remove_bg('assets/neon_tree_1775236618044.png')
print("Done")
