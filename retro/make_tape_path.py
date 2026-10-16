import numpy as np

# Let's fit smooth bezier curves or points for the tape centerline
# Key waypoints along the tape in 1024x576:
pts = [
    (235, 195),
    (270, 202),
    (310, 212),
    (345, 225),
    (368, 255),
    (390, 275),
    (425, 272),
    (465, 246),
    (502, 242),
    (538, 260),
    (575, 295),
    (615, 312),
    (665, 306),
    (715, 292),
    (755, 284),
    (790, 300),
    (818, 350),
    (824, 430),
    (805, 520),
    (750, 560),
    (700, 545),
    (695, 490),
    (710, 445),
    (750, 440),
    (810, 438),
]

# Create SVG path string using Catmull-Rom or smooth cubic beziers:
def catmull_to_bezier(pts):
    d = [f"M {pts[0][0]} {pts[0][1]}"]
    for i in range(len(pts) - 1):
        p0 = pts[i-1] if i > 0 else pts[i]
        p1 = pts[i]
        p2 = pts[i+1]
        p3 = pts[i+2] if i + 2 < len(pts) else p2
        
        # Tension factor 0.5 (standard Catmull-Rom)
        c1x = p1[0] + (p2[0] - p0[0]) / 6.0
        c1y = p1[1] + (p2[1] - p0[1]) / 6.0
        c2x = p2[0] - (p3[0] - p1[0]) / 6.0
        c2y = p2[1] - (p3[1] - p1[1]) / 6.0
        
        d.append(f"C {c1x:.1f} {c1y:.1f}, {c2x:.1f} {c2y:.1f}, {p2[0]} {p2[1]}")
    return " ".join(d)

path_d = catmull_to_bezier(pts)
print("SVG Path d:")
print(path_d)

with open(r"Frontend\src\assets\images\tape_path.txt", "w") as f:
    f.write(path_d)
