from PIL import Image, ImageDraw

def create_icon(size):
    scale = size / 192
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))

    bg_draw = ImageDraw.Draw(img)
    bg_draw.ellipse([0, 0, size - 1, size - 1], fill=(255, 255, 255, 255))

    stripe_h = size / 6
    colors = [
        (233, 69, 96),
        (255, 140, 66),
        (255, 215, 0),
        (76, 175, 80),
        (79, 195, 247),
        (206, 147, 216),
    ]

    stripes = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stripes)
    for i, c in enumerate(colors):
        sd.rectangle([0, int(i * stripe_h), size, int((i + 1) * stripe_h)], fill=(*c, 255))

    mask = Image.new('L', (size, size), 0)
    md = ImageDraw.Draw(mask)

    cy = 96 * scale
    r_out = 38 * scale
    r_in  = 20 * scale

    for cx in [52 * scale, 140 * scale]:
        md.ellipse([cx - r_out, cy - r_out, cx + r_out, cy + r_out], fill=255)
        md.pieslice([cx - r_out - 2, cy - r_out - 2, cx + r_out + 2, cy + r_out + 2],
                    start=-45, end=45, fill=0)
        md.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=0)

    stripes.putalpha(mask)
    img.paste(stripes, (0, 0), stripes)
    return img

for size in [192, 512]:
    create_icon(size).save(f'icons/icon-{size}.png')
    print(f'icons/icon-{size}.png created')
