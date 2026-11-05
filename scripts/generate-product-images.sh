#!/bin/bash
# scripts/generate-product-images.sh
# Generates 20 product placeholder images using the z-ai CLI.
# Each image is 1024x1024 (square, suitable for product cards).
#
# Run from project root:  bash scripts/generate-product-images.sh
# Output dir:             public/photos/

set -e
OUT_DIR="public/photos"
mkdir -p "$OUT_DIR"

# Common style suffix for consistency across all products.
# Cream background (#f6fbf1) matches the site's bg, soft studio lighting,
# premium food-photography look.
STYLE="professional product photography, single item centered, soft studio lighting, cream colored background, top-down angle, premium food packaging, high detail, sharp focus, 1024x1024"

# Declare products as an array (id|prompt).
declare -a PRODUCTS=(
  "premium-gold-tea|a 500g foil pouch of premium Assam CTC black tea, golden amber color, elegant minimalist Indian packaging"
  "royal-leaf-tea|a 250g box of premium orthodox Assam whole leaf tea, deep amber color, luxurious royal gold packaging"
  "masala-chai-blend|a 250g pouch of masala chai tea blend with cardamom and spices visible, warm spice tones, Indian heritage packaging"
  "green-tea|a 100g box of premium Assam green tea leaves, fresh green color, minimalist zen-inspired packaging"
  "premium-dates|a 500g pack of soft premium brown dates, plump and glossy, kraft paper pouch packaging"
  "medjool-dates|a 500g luxury box of large medjool dates, deep caramel brown, royal black and gold packaging"
  "ajwa-dates|a 250g premium box of dark ajwa dates from Madinah, deep black-brown color, sacred elegant packaging"
  "stuffed-dates|a 200g clear pack of soft dates stuffed with almonds and cashews, gourmet gift packaging"
  "premium-cashews|a 250g pouch of premium whole W240 grade cashews, ivory white, minimalist kraft packaging"
  "salted-cashews|a 250g pouch of roasted salted cashews with pink salt, golden roasted color, modern snack packaging"
  "premium-almonds|a 250g pouch of premium whole almonds, brown-skinned, natural organic packaging"
  "golden-raisins|a 250g pouch of golden yellow raisins kishmish, sun-dried, bright golden color, kraft pouch packaging"
  "kerala-banana-chips|a 250g pouch of thin-sliced Kerala banana chips, golden yellow color, traditional Indian snack packaging"
  "peri-peri-banana-chips|a 250g pouch of red-coated peri peri banana chips, vibrant red color, modern spicy snack packaging"
  "black-pepper-banana-chips|a 250g pouch of black-pepper-coated banana chips with visible pepper dots, premium snack packaging"
  "tapioca-chips|a 250g pouch of crispy white tapioca chips kappa, golden white color, traditional Kerala packaging"
  "turmeric-powder|a 250g jar of bright orange turmeric powder Lakadong, vibrant orange-yellow color, glass jar packaging"
  "kashmiri-chilli-powder|a 250g jar of vibrant red Kashmiri chilli powder, deep red color, glass jar packaging"
  "garam-masala|a 250g jar of brown garam masala spice blend, warm brown color, premium glass jar packaging"
  "indian-chai-spice|a 100g jar of ground chai masala spice mix, brown color with visible spice particles, small glass jar packaging"
)

echo "Generating ${#PRODUCTS[@]} product images (sequential, retry-safe)..."
echo "Output: $OUT_DIR/"
echo ""

failed=()
for entry in "${PRODUCTS[@]}"; do
  id="${entry%%|*}"
  prompt="${entry#*|}"
  out="$OUT_DIR/${id}.png"
  
  # Skip if file already exists (idempotent).
  if [ -f "$out" ]; then
    echo "✓ exists: $id.png"
    continue
  fi

  echo "→ generating: $id.png"
  
  # Try up to 5 times with exponential backoff (5s, 10s, 20s, 40s).
  success=0
  for attempt in 1 2 3 4 5; do
    if z-ai image -p "${prompt}, ${STYLE}" -o "$out" -s 1024x1024 > /dev/null 2>&1; then
      echo "  ✓ done on attempt $attempt"
      success=1
      break
    else
      wait_time=$((5 * (2 ** (attempt - 1))))
      echo "  ✗ attempt $attempt failed, waiting ${wait_time}s..."
      sleep $wait_time
    fi
  done
  
  if [ $success -eq 0 ]; then
    echo "  ✗ FAILED after 5 attempts"
    failed+=("$id")
  fi
  
  # Small delay between images to avoid rate limiting.
  sleep 3
done

echo ""
echo "=== Summary ==="
total=$(ls -1 "$OUT_DIR"/*.png 2>/dev/null | wc -l)
echo "Generated images: $total / ${#PRODUCTS[@]}"
if [ ${#failed[@]} -gt 0 ]; then
  echo "Failed: ${failed[*]}"
else
  echo "All images generated successfully!"
fi
