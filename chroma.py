from PIL import Image
import os
import collections

def chroma_key(img_path, target_path):
    print(f"Chroma Keying: {img_path}")
    if not os.path.exists(img_path):
        print("Not found:", img_path)
        return
        
    img = Image.open(img_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    
    visited = set()
    queue = collections.deque()
    
    for i in range(width):
        queue.append((i, 0))
        queue.append((i, height - 1))
    for j in range(height):
        queue.append((0, j))
        queue.append((width - 1, j))
        
    bg_col = pixels[0, 0] # Assume top-left corner is pure background
    
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited: continue
        visited.add((x, y))
        p = pixels[x, y]
        if p[3] == 0: continue
            
        # Background is Magenta. Or whatever color corner 0,0 is! 
        # For our specific generation we expect a magenta-ish color
        # Even if generator added a gradient, we use a 45/255 tolerance
        if abs(p[0]-bg_col[0]) < 60 and abs(p[1]-bg_col[1]) < 60 and abs(p[2]-bg_col[2]) < 60:
            pixels[x, y] = (0, 0, 0, 0)
            if x > 0: queue.append((x - 1, y))
            if x < width - 1: queue.append((x + 1, y))
            if y > 0: queue.append((x, y - 1))
            if y < height - 1: queue.append((x, y + 1))
            
    img.save(target_path)
    print("Saved ->", target_path)

if not os.path.exists('assets'):
    os.makedirs('assets')

base_path = r"C:\Users\j_cuz\.gemini\antigravity\brain\f46c21ff-8330-4198-809e-016d0dce682e"
chroma_key(f"{base_path}\\cyber_shop_v2_1775238377986.png", 'assets/cyber_shop_v2.png')
chroma_key(f"{base_path}\\cyber_clinic_1775238389594.png", 'assets/cyber_clinic_v2.png')
chroma_key(f"{base_path}\\cyber_tree_v2_1775238402969.png", 'assets/cyber_tree_v2.png')
