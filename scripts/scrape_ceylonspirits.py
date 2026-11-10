#!/usr/bin/env python3
import os
import re
import json
import html
import urllib.request
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text).strip('-')
    return text or 'general'

def strip_tags(text):
    if not text:
        return ""
    text = html.unescape(text)
    clean = re.compile('<.*?>')
    cleaned = re.sub(clean, '', text).strip()
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned

def map_category(cats, name):
    name_l = name.lower()
    cat_names = [c.get('name', '').lower() for c in cats]
    all_text = ' '.join(cat_names) + ' ' + name_l

    if any(x in all_text for x in ['beer', 'lager', 'stout', 'ale', 'pilsner', 'cider', 'carlsberg', 'heineken', 'lion', 'corona', 'tiger', 'benediktiner']):
        return 'Beer'
    if any(x in all_text for x in ['arrack', 'halmilla', 'old arrack', 'coconut arrack', 'vsoa', 'dcsl', 'rockland', 'mendis']):
        return 'Arrack'
    if any(x in all_text for x in ['whisky', 'whiskey', 'scotch', 'bourbon', 'single malt', 'blended whisky', 'chivas', 'johnnie', 'glenfiddich', 'jack daniel', 'jameson', 'monkey shoulder', 'talisker', 'laphroaig', 'ballantine']):
        return 'Whisky'
    if any(x in all_text for x in ['vodka', 'smirnoff', 'absolut', 'belvedere', 'grey goose', 'stolichnaya', 'ciroc', 'sky']):
        return 'Vodka'
    if any(x in all_text for x in ['gin', 'botanist', 'bombay', 'tanqueray', 'hendrick', 'colombo gin', 'gordon', 'beefeater', 'roku']):
        return 'Gin'
    if any(x in all_text for x in ['rum', 'bacardi', 'captain morgan', 'havana club', 'malibu']):
        return 'Rum'
    if any(x in all_text for x in ['wine', 'champagne', 'cabernet', 'sauvignon', 'merlot', 'shiraz', 'chardonnay', 'prosecco', 'pinot', 'rose', 'rosé', 'bordeaux', 'sparkling', 'sangiovese', 'malbec']):
        return 'Wine'
    return 'Whisky'

def get_product_colors(cat, name):
    cat_l = cat.lower()
    name_l = name.lower()
    if cat_l == 'wine':
        if any(x in name_l for x in ['white', 'chardonnay', 'sauvignon blanc', 'pinot grigio']):
            return {
                "accent": "#d4af37",
                "bgFrom": "#111005",
                "bgTo": "#242008",
                "label": "#fbf8ef",
                "glass": "#a3be52",
                "shape": "wine"
            }
        elif any(x in name_l for x in ['rosé', 'rose', 'pink']):
            return {
                "accent": "#e6739f",
                "bgFrom": "#17060f",
                "bgTo": "#2f0d1e",
                "label": "#fff2f6",
                "glass": "#d97495",
                "shape": "wine"
            }
        else: # Red wine / champagne
            return {
                "accent": "#93182b",
                "bgFrom": "#140306",
                "bgTo": "#2a080f",
                "label": "#f4ede1",
                "glass": "#420911",
                "shape": "wine"
            }
    elif cat_l == 'whisky':
        return {
            "accent": "#d97706",
            "bgFrom": "#140901",
            "bgTo": "#2b1605",
            "label": "#faeedb",
            "glass": "#94470c",
            "shape": "spirit"
        }
    elif cat_l == 'vodka':
        return {
            "accent": "#0ea5e9",
            "bgFrom": "#020f18",
            "bgTo": "#052236",
            "label": "#f0f9ff",
            "glass": "#7dd3fc",
            "shape": "spirit"
        }
    elif cat_l == 'gin':
        return {
            "accent": "#10b981",
            "bgFrom": "#02120b",
            "bgTo": "#072e1c",
            "label": "#ecfdf5",
            "glass": "#34d399",
            "shape": "spirit"
        }
    elif cat_l == 'rum':
        return {
            "accent": "#b45309",
            "bgFrom": "#120500",
            "bgTo": "#2b0f02",
            "label": "#faeedb",
            "glass": "#602706",
            "shape": "spirit"
        }
    elif cat_l == 'arrack':
        return {
            "accent": "#c59b27",
            "bgFrom": "#110b01",
            "bgTo": "#2b1c04",
            "label": "#f9f2e0",
            "glass": "#7e5210",
            "shape": "spirit"
        }
    elif cat_l == 'beer':
        if 'can' in name_l:
            return {
                "accent": "#06b6d4",
                "bgFrom": "#020f14",
                "bgTo": "#05232d",
                "label": "#e0f2fe",
                "glass": "#38bdf8",
                "shape": "can"
            }
        elif 'stout' in name_l:
            return {
                "accent": "#78350f",
                "bgFrom": "#0a0402",
                "bgTo": "#1c0b03",
                "label": "#f3ebde",
                "glass": "#210d05",
                "shape": "beerBottle"
            }
        else:
            return {
                "accent": "#eab308",
                "bgFrom": "#141001",
                "bgTo": "#2e2402",
                "label": "#fef9c3",
                "glass": "#b58712",
                "shape": "beerBottle"
            }
    return {
        "accent": "#d4af37",
        "bgFrom": "#120800",
        "bgTo": "#281504",
        "label": "#faeedb",
        "glass": "#94470c",
        "shape": "spirit"
    }

def fetch_all_products():
    all_products = []
    print("Fetching products from Ceylon Spirits API...")
    for page in range(1, 6):
        url = f"https://ceylonspirits.lk/wp-json/wc/store/v1/products?per_page=100&page={page}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                all_products.extend(data)
                print(f"  Page {page}: fetched {len(data)} products")
        except Exception as e:
            print(f"  Error page {page}: {e}")
    return all_products

def main():
    base_dir = "/Users/kavindusasmitha/Desktop/Ceylix Soft/winestore/winestore-fe"
    public_products_dir = os.path.join(base_dir, "public", "products")
    os.makedirs(public_products_dir, exist_ok=True)

    raw_products = fetch_all_products()
    print(f"Total raw products fetched: {len(raw_products)}")

    parsed_items = []
    download_tasks = []

    for raw in raw_products:
        p_id = raw.get('id')
        name = html.unescape(raw.get('name', '')).strip()
        slug = raw.get('slug', f'product-{p_id}')

        # Extract brand
        brand = "Other"
        for attr in raw.get('attributes', []):
            if attr.get('name') == 'Brand' and attr.get('terms'):
                brand = html.unescape(attr['terms'][0]['name']).strip()
                break

        brand_slug = slugify(brand)

        # Extract ABV & Volume
        abv = "40%"
        volume = "750ml"
        for attr in raw.get('attributes', []):
            attr_name = attr.get('name', '').lower()
            if 'abv' in attr_name and attr.get('terms'):
                abv = attr['terms'][0]['name'].strip()
            elif 'size' in attr_name and attr.get('terms'):
                volume = attr['terms'][0]['name'].strip()

        # Extract Price (in Ceylon Spirits prices are minor units e.g. 700000 = Rs. 7,000)
        price_str = raw.get('prices', {}).get('price', '0')
        try:
            price_val = int(price_str) // 100
        except:
            price_val = 5000
        if price_val <= 0:
            price_val = 4500

        # Description / Tasting Notes
        desc = strip_tags(raw.get('description', '') or raw.get('short_description', ''))
        # Remove promotional shop links
        desc = re.sub(r'View (all products|cocktails).*', '', desc, flags=re.IGNORECASE).strip()
        if not desc or len(desc) < 15:
            desc = f"Premium {name} curated from {brand}. Exceptional quality and authentic distillation character."
        else:
            # Keep first 2 sentences for crisp presentation
            sentences = desc.split('. ')
            desc = '. '.join(sentences[:2]).strip()
            if not desc.endswith('.'):
                desc += '.'

        category = map_category(raw.get('categories', []), name)

        sub_cat = ""
        for c in raw.get('categories', []):
            c_name = c.get('name', '')
            if c_name not in ['Spirits', 'Imported', 'Local', 'Wine & Champagne', 'Wine']:
                sub_cat = c_name
                break
        if not sub_cat:
            sub_cat = f"{brand} {category}"

        colors = get_product_colors(category, name)

        # Image selection
        images = raw.get('images', [])
        img_url = None
        local_img_path = None
        if images:
            # Choose medium / thumbnail or src
            img_url = images[0].get('src')
            # Extract file extension
            parsed_url = urlparse(img_url)
            ext = os.path.splitext(parsed_url.path)[1] or '.jpg'
            if ext.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                ext = '.jpg'

            img_filename = f"{slug}{ext}"
            brand_folder = os.path.join(public_products_dir, brand_slug)
            os.makedirs(brand_folder, exist_ok=True)
            target_file = os.path.join(brand_folder, img_filename)
            local_img_path = f"/products/{brand_slug}/{img_filename}"

            download_tasks.append({
                "url": img_url,
                "target": target_file
            })

        parsed_items.append({
            "id": p_id,
            "name": name,
            "brand": brand,
            "brandSlug": brand_slug,
            "category": category,
            "subCategory": sub_cat,
            "abv": abv,
            "volume": volume,
            "priceLKR": price_val,
            "notes": desc,
            "accentColor": colors["accent"],
            "bgFrom": colors["bgFrom"],
            "bgTo": colors["bgTo"],
            "labelColor": colors["label"],
            "glassColor": colors["glass"],
            "shape": colors["shape"],
            "image": local_img_path
        })

    print(f"\nPrepared {len(parsed_items)} products across {len(set(p['brand'] for p in parsed_items))} brands.")
    print(f"Downloading {len(download_tasks)} images concurrently...")

    def download_img(task):
        target = task["target"]
        if os.path.exists(target) and os.path.getsize(target) > 500:
            return True # Already downloaded
        try:
            req = urllib.request.Request(task["url"], headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                if len(data) > 200:
                    with open(target, 'wb') as f:
                        f.write(data)
                    return True
        except Exception as e:
            pass
        return False

    success_count = 0
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(download_img, t): t for t in download_tasks}
        for future in as_completed(futures):
            if future.result():
                success_count += 1
            if success_count % 50 == 0:
                print(f"  Progress: {success_count}/{len(download_tasks)} images downloaded")

    print(f"\nDownloaded {success_count} images successfully!")

    # Write data file
    output_ts = os.path.join(base_dir, "src", "data", "products.ts")
    with open(output_ts, "w", encoding="utf-8") as f:
        f.write('export type ProductCategory = "Wine" | "Whisky" | "Vodka" | "Rum" | "Arrack" | "Gin" | "Beer";\n')
        f.write('export type BottleShape = "wine" | "spirit" | "beerBottle" | "can";\n\n')
        f.write('export interface Product {\n')
        f.write('  id: number;\n')
        f.write('  name: string;\n')
        f.write('  brand: string;\n')
        f.write('  category: ProductCategory;\n')
        f.write('  subCategory?: string;\n')
        f.write('  abv: string;\n')
        f.write('  volume: string;\n')
        f.write('  priceLKR: number;\n')
        f.write('  notes: string;\n')
        f.write('  accentColor: string;\n')
        f.write('  bgFrom: string;\n')
        f.write('  bgTo: string;\n')
        f.write('  labelColor: string;\n')
        f.write('  glassColor: string;\n')
        f.write('  shape: BottleShape;\n')
        f.write('  image?: string | null;\n')
        f.write('}\n\n')

        f.write('export const PRODUCTS: Product[] = ')
        f.write(json.dumps(parsed_items, indent=2, ensure_ascii=False))
        f.write(';\n\n')

        # Generate curated showcase categories
        f.write('export const SHOWCASE_CATEGORIES: { categoryName: string; categoryKey: ProductCategory; items: Product[] }[] = [\n')
        f.write('  {\n')
        f.write('    categoryName: "Grand Vintages & Fine Wines",\n')
        f.write('    categoryKey: "Wine",\n')
        f.write('    items: PRODUCTS.filter((p) => p.category === "Wine" && p.image).slice(0, 5)\n')
        f.write('  },\n')
        f.write('  {\n')
        f.write('    categoryName: "Iconic Whiskies, Vodkas & Pure Ceylon Arrack",\n')
        f.write('    categoryKey: "Whisky",\n')
        f.write('    items: PRODUCTS.filter((p) => ["Whisky", "Arrack", "Vodka", "Gin", "Rum"].includes(p.category) && p.image).slice(0, 6)\n')
        f.write('  },\n')
        f.write('  {\n')
        f.write('    categoryName: "Chilled Beers & Craft Micro-Brews",\n')
        f.write('    categoryKey: "Beer",\n')
        f.write('    items: PRODUCTS.filter((p) => p.category === "Beer" && p.image).slice(0, 5)\n')
        f.write('  }\n')
        f.write('];\n')

    print(f"Wrote updated {output_ts} with {len(parsed_items)} products.")

if __name__ == "__main__":
    main()

