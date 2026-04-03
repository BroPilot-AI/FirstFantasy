from PIL import Image
import collections

def strip_bg(img_path):
    print(f"\nStripping {img_path}")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print("Could not open", img_path)
        return
        
    pixels = img.load()
    width, height = img.size
    
    bg_col = pixels[0, 0]
    print("Background color matches:", bg_col)
    
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
        if (x, y) in visited: continue
        visited.add((x, y))
        
        p = pixels[x, y]
        if p[3] == 0: continue
            
        # Tolerance of 8 ensures we catch minor jpeg artifacts if any without bleeding into dark shadows
        if abs(p[0]-bg_col[0]) < 8 and abs(p[1]-bg_col[1]) < 8 and abs(p[2]-bg_col[2]) < 8:
            pixels[x, y] = (0, 0, 0, 0)
            if x > 0: queue.append((x - 1, y))
            if x < width - 1: queue.append((x + 1, y))
            if y > 0: queue.append((x, y - 1))
            if y < height - 1: queue.append((x, y + 1))
            
    img.save(img_path)
    print("Saved ->", img_path)

strip_bg('assets/cyber_shop_v3.png')
strip_bg('assets/cyber_clinic_v3.png')
strip_bg('assets/cyber_tree_v3.png')
strip_bg('assets/smashed_robot.png')
strip_bg('assets/cyber_fountain.png')
strip_bg('assets/neon_sign.png')
