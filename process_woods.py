import collections
from PIL import Image

def strip_bg(img_path, target_path):
    print("Stripping", img_path)
    img = Image.open(img_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    bg_col = pixels[0, 0]
    
    visited = set()
    queue = collections.deque()
    for i in range(width): queue.append((i, 0)); queue.append((i, height - 1))
    for j in range(height): queue.append((0, j)); queue.append((width - 1, j))
        
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited: continue
        visited.add((x, y))
        p = pixels[x, y]
        if p[3] == 0: continue
        if abs(p[0]-bg_col[0]) < 8 and abs(p[1]-bg_col[1]) < 8 and abs(p[2]-bg_col[2]) < 8:
            pixels[x, y] = (0, 0, 0, 0)
            if x > 0: queue.append((x - 1, y))
            if x < width - 1: queue.append((x + 1, y))
            if y > 0: queue.append((x, y - 1))
            if y < height - 1: queue.append((x, y + 1))
    img.save(target_path)
    print("Saved ->", target_path)

strip_bg(r"C:\Users\j_cuz\.gemini\antigravity\brain\f46c21ff-8330-4198-809e-016d0dce682e\cyber_woods_1775245602351.png", "assets/cyber_woods.png")
