import os
import sys
import re
import json
import shutil
import zipfile
import urllib.request
import urllib.parse

PRODUCT_ID = "9NBLN3DGZCNP"
PRODUCT_URL = f"https://apps.microsoft.com/detail/{PRODUCT_ID}?hl=en-US&gl=US"
GAME_NAME = "Fuzz Bugs Factory Hop"

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def ask_yn(prompt):
    while True:
        r = input(f"{prompt} (Y/N): ").strip().upper()
        if r in ['Y', 'YES']: return True
        if r in ['N', 'NO']: return False

def script_dir():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

def download(url, dest):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    })
    
    print("  Downloading...")
    with urllib.request.urlopen(req, timeout=300) as resp:
        total = resp.headers.get('Content-Length')
        total = int(total) if total else None
        got = 0
        
        with open(dest, 'wb') as f:
            while True:
                chunk = resp.read(65536)
                if not chunk: break
                f.write(chunk)
                got += len(chunk)
                
                if total:
                    pct = got * 100 / total
                    bar = '█' * int(30 * got / total) + '░' * (30 - int(30 * got / total))
                    print(f"\r  [{bar}] {pct:5.1f}% ({got/1024/1024:.1f}/{total/1024/1024:.1f} MB)", end="", flush=True)
        print()

def get_download_url():
    print()
    print("[1/3] Getting download link...")
    print("      (can take 30-60 seconds)")
    print()
    
    body = f"type=url&url={urllib.parse.quote(PRODUCT_URL)}&ring=Fast&lang=en-US"
    req = urllib.request.Request(
        "https://store.rg-adguard.net/api/GetFiles",
        data=body.encode('utf-8'),
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Origin": "https://store.rg-adguard.net",
            "Referer": "https://store.rg-adguard.net/"
        }
    )
    
    with urllib.request.urlopen(req, timeout=120) as resp:
        html = resp.read().decode('utf-8')
    
    for m in re.finditer(r'<a\s+href="([^"]+)"[^>]*>([^<]+\.appx)</a>', html, re.I):
        url, name = m.group(1), m.group(2).strip()
        if '.eappx' in name.lower() or 'blockmap' in name.lower():
            continue
        if 'x64' in name.lower():
            print(f"  Found: {name}")
            return url, name
    
    raise Exception("no .appx link found")

def find_exe(d):
    for f in os.listdir(d):
        if f.lower().endswith('.exe') and 'uninstall' not in f.lower():
            return f
    return None

def find_game_files(d):
    for root, dirs, files in os.walk(d):
        if 'app.min.js' in files:
            return root
    return None

def download_game(install_dir):
    tmp = os.path.join(install_dir, "_tmp")
    os.makedirs(tmp, exist_ok=True)
    
    try:
        url, filename = get_download_url()
        
        print()
        print("[2/3] Downloading game (~50 MB)...")
        appx = os.path.join(tmp, filename)
        download(url, appx)
        
        print()
        print("[3/3] Extracting game...")
        extract = os.path.join(tmp, "ex")
        with zipfile.ZipFile(appx, 'r') as z:
            z.extractall(extract)
        
        app_src = os.path.join(extract, "app")
        if not os.path.exists(app_src):
            app_src = extract
        
        exe = find_exe(app_src)
        if exe:
            print(f"  Found executable: {exe}")
        
        game_dir = os.path.join(install_dir, GAME_NAME)
        if os.path.exists(game_dir):
            shutil.rmtree(game_dir)
        shutil.move(app_src, game_dir)
        
        game_files = find_game_files(game_dir)
        if game_files:
            print(f"  Game files found at: {os.path.relpath(game_files, game_dir)}")
        
        shutil.rmtree(tmp, ignore_errors=True)
        return game_dir, game_files, exe
        
    except Exception as e:
        shutil.rmtree(tmp, ignore_errors=True)
        raise

def install_mods(game_files_dir):
    sd = script_dir()
    
    print()
    print("  Installing mod loader...")
    
    for f in ['index.html', 'main.js']:
        src = os.path.join(sd, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(game_files_dir, f))
            print(f"    Installed {f}")
    
    src_mods = os.path.join(sd, 'mods')
    dst_mods = os.path.join(game_files_dir, 'mods')
    if os.path.exists(src_mods):
        if os.path.exists(dst_mods):
            shutil.rmtree(dst_mods)
        shutil.copytree(src_mods, dst_mods)
        print("    Installed mods/")
    
    pkg = os.path.join(game_files_dir, "package.json")
    with open(pkg, 'w') as f:
        json.dump({"name": "fuzz-bugs-factory-hop", "version": "1.0.0", "main": "main.js"}, f)
    print("    Updated package.json")
    
    print("  Done!")

def main():
    clear()
    print("=" * 60)
    print("  Fuzz Bugs Factory Hop - Installer")
    print("=" * 60)
    print()
    
    has_game = ask_yn("Do you already have the game installed?")
    
    if has_game:
        print()
        print("Enter the path to your game's app folder")
        print("(the folder with app.min.js)")
        print()
        
        while True:
            path = input("Path: ").strip().strip('"\'')
            if not path: continue
            path = os.path.expanduser(path)
            
            if os.path.exists(os.path.join(path, 'app.min.js')):
                break
            elif os.path.exists(os.path.join(path, 'resources', 'app', 'app.min.js')):
                path = os.path.join(path, 'resources', 'app')
                break
            else:
                print("  can't find app.min.js there")
        
        install_mods(path)
        
        print()
        print("=" * 60)
        print("  MODS INSTALLED")
        print("=" * 60)
        print()
        print("  Press TAB in-game for the mod menu")
        
    else:
        print()
        print("Where to install?")
        print(f"(a '{GAME_NAME}' folder will be created)")
        print()
        
        default = script_dir()
        print(f"Press Enter for: {default}")
        
        path = input("Location: ").strip().strip('"\'')
        if not path:
            path = default
        
        path = os.path.expanduser(path)
        os.makedirs(path, exist_ok=True)
        
        print()
        
        try:
            game_dir, game_files, exe = download_game(path)
            
            if game_files:
                install_mods(game_files)
            
            print()
            print("=" * 60)
            print("  INSTALLATION COMPLETE")
            print("=" * 60)
            print()
            print(f"  Installed to: {game_dir}")
            if exe:
                print(f"  Run: {exe}")
            print()
            print("  Press TAB in-game for the mod menu")
            print()
            
            if os.name == 'nt' and exe:
                if ask_yn("Launch now?"):
                    import subprocess
                    subprocess.Popen([os.path.join(game_dir, exe)], cwd=game_dir)
            
        except Exception as e:
            print(f"\n  Error: {e}")
            import traceback
            traceback.print_exc()
    
    print()
    input("Press Enter to exit...")

if __name__ == "__main__":
    main()
