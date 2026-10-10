import os
import sys
from PIL import Image, ImageOps

def compress_cards(
    src_dir=r"C:\Users\user\CrossDevice\Pixel 10 Pro XL\storage\DCIM\Osho",
    out_dir=r"c:\Users\user\我的雲端硬碟\0LearnDulanWay\osho\images",
    max_dimension=1000,
    quality=82
):
    """
    壓縮奧修禪卡圖片至適合 GitHub 與網頁載入的大小（通常可壓到 10~15MB 以下）
    - 自動依據 EXIF 轉正方向（避免手機直拍圖片橫躺）
    - 縮放長邊至 max_dimension（預設 1000px）
    - 轉為高品質 JPEG（品質 82），大幅減少 90% 以上體積
    """
    if not os.path.exists(src_dir):
        print(f"[錯誤] 來源目錄不存在: {src_dir}")
        return

    os.makedirs(out_dir, exist_ok=True)
    files = [f for f in os.listdir(src_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    files = sorted(files, key=lambda x: int(os.path.splitext(x)[0]) if os.path.splitext(x)[0].isdigit() else 999)

    print(f"找到 {len(files)} 張圖卡，開始壓縮至: {out_dir}")
    total_orig = 0
    total_new = 0

    for idx, f in enumerate(files, 1):
        src_path = os.path.join(src_dir, f)
        out_path = os.path.join(out_dir, f)
        orig_size = os.path.getsize(src_path)
        total_orig += orig_size

        with Image.open(src_path) as img:
            # 依據手機 EXIF 資訊自動旋轉正確方向
            img = ImageOps.exif_transpose(img)
            # 等比例縮小（長邊不超過 max_dimension）
            img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            # 儲存高品質並優化檔案大小
            img.save(out_path, 'JPEG', quality=quality, optimize=True)

        new_size = os.path.getsize(out_path)
        total_new += new_size
        print(f"[{idx}/{len(files)}] {f}: {orig_size/1024:.0f}KB -> {new_size/1024:.0f}KB")

    print("\n" + "="*40)
    print(f"處理完成！共 {len(files)} 張圖卡")
    print(f"原始總容量: {total_orig / (1024*1024):.2f} MB")
    print(f"壓縮後容量: {total_new / (1024*1024):.2f} MB")
    print(f"減少幅度: {(1 - total_new/total_orig)*100:.1f}%")
    print(f"檔案已儲存至: {out_dir}")
    print("="*40)

if __name__ == "__main__":
    compress_cards()
