import shutil

base_path = r"C:\Users\j_cuz\.gemini\antigravity\brain\f46c21ff-8330-4198-809e-016d0dce682e"
files = [
    "cyber_shop_v3_1775238709664.png",
    "cyber_clinic_v3_1775238721415.png",
    "cyber_tree_v3_1775238736506.png",
    "smashed_robot_1775238748138.png",
    "cyber_fountain_1775238760733.png",
    "neon_sign_1775238774029.png"
]

for f in files:
    src = f"{base_path}\\{f}"
    name = f.rsplit('_', 1)[0] + ".png" 
    shutil.copy(src, f"assets/{name}")
    print("Copied to assets/" + name)
