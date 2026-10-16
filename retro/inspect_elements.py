from PIL import Image

img = Image.open(r"Frontend\src\assets\images\timeline-cassette.jpg")
w, h = img.size

# 1. Top center waveform:
# x: ~420 to 620, y: ~40 to 140
crop_wave = img.crop((420, 30, 620, 140))
crop_wave.save(r"Frontend\src\assets\images\inspect_waveform.png")

# 2. Top right radar / pulse:
# x: ~650 to 920, y: ~0 to 220
crop_radar = img.crop((650, 0, 920, 220))
crop_radar.save(r"Frontend\src\assets\images\inspect_radar.png")

# 3. Bottom left globe and rings:
crop_globe_rings = img.crop((0, 260, 320, 576))
crop_globe_rings.save(r"Frontend\src\assets\images\inspect_globe_rings.png")

print("Saved inspect crops")
