Build a production-ready web application called "PixelCraft".

OVERVIEW

PixelCraft is a simple web application that converts uploaded images into pixel art.

The user flow must be extremely simple:

1. Upload image
2. Crop image
3. Configure pixel art settings
4. Generate pixel art
5. Preview result
6. Download PNG

IMPORTANT:

Do NOT build a pixel editor.

Do NOT allow drawing, painting, modifying pixels, layers, brushes, selections, animation, or canvas editing.

The application is a photo-to-pixel-art converter only.

All image processing must happen locally in the browser.

Do NOT use AI, machine learning, OpenAI APIs, image generation APIs, or any cloud image processing.

Use traditional image processing algorithms only.

--------------------------------------------------
TECH STACK
--------------------------------------------------

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui

Optional:

- react-easy-crop for cropping

All processing must run client-side.

No backend required.

--------------------------------------------------
CORE USER FLOW
--------------------------------------------------

Upload Image
↓
Crop Image
↓
Choose Settings
↓
Generate Pixel Art
↓
Preview
↓
Download PNG

--------------------------------------------------
FEATURE 1 — IMAGE UPLOAD
--------------------------------------------------

Requirements:

Supported formats:

- PNG
- JPG
- JPEG
- WEBP

Maximum size:

- 20MB

Show preview immediately after upload.

Validation:

- Invalid format
- File too large

Display clear error messages.

--------------------------------------------------
FEATURE 2 — IMAGE CROPPING
--------------------------------------------------

After upload, show crop interface.

Requirements:

- Drag crop area
- Zoom image
- Square crop ratio
- Free crop ratio

Allow user to:

- Move image
- Zoom image
- Reposition crop area

Buttons:

- Cancel
- Apply Crop

After crop is applied, continue to generation settings.

--------------------------------------------------
FEATURE 3 — PIXEL ART GENERATION
--------------------------------------------------

Processing pipeline:

Load image
↓
Apply crop
↓
Resize image
↓
Color quantization
↓
Optional dithering
↓
Render pixel art

--------------------------------------------------
RESOLUTION SETTINGS
--------------------------------------------------

Allow user to choose:

- 16x16
- 32x32
- 48x48
- 64x64
- 96x96
- 128x128
- 256x256

Default:

64x64

Display estimated output size.

--------------------------------------------------
COLOR SETTINGS
--------------------------------------------------

Allow user to choose color count:

- 8
- 16
- 32
- 64
- 128
- 256

Default:

32

Implement color quantization locally.

--------------------------------------------------
DITHERING SETTINGS
--------------------------------------------------

Options:

- None
- Floyd-Steinberg
- Bayer Ordered

Default:

None

Provide explanation tooltip for each option.

--------------------------------------------------
FEATURE 4 — PREVIEW
--------------------------------------------------

Display generated pixel art.

Requirements:

- Crisp rendering
- No blur
- No anti-aliasing
- Pixel-perfect scaling

Allow zoom levels:

- 1x
- 2x
- 4x
- 8x

Preview must update immediately after generation.

--------------------------------------------------
FEATURE 5 — DOWNLOAD
--------------------------------------------------

Allow user to download PNG.

Export scales:

- 1x
- 2x
- 4x
- 8x
- 16x

Requirements:

- Preserve transparency
- No blur
- Pixel-perfect output

Filename example:

pixel-art-2026-05-30.png

--------------------------------------------------
FEATURE 6 — PALETTE PREVIEW
--------------------------------------------------

Display generated palette.

Requirements:

- Show all colors used
- Display color swatches
- Display total color count

Read-only palette.

No editing required.

--------------------------------------------------
UI LAYOUT
--------------------------------------------------

Desktop

--------------------------------------------------
| Header                                           |
--------------------------------------------------

| Upload Area                                     |

↓

| Crop Area                                       |

↓

--------------------------------------------------
| Settings                                         |
--------------------------------------------------

Resolution

Color Count

Dithering

Generate Button

--------------------------------------------------

| Pixel Art Preview                               |

--------------------------------------------------

| Palette Preview                                 |

--------------------------------------------------

| Download Button                                 |

--------------------------------------------------

Mobile

Everything should stack vertically.

--------------------------------------------------
ARCHITECTURE
--------------------------------------------------

Use feature-based architecture.

src/

features/

  upload/
  crop/
  generator/
  preview/
  export/

components/

  upload-zone/
  cropper/
  settings-panel/
  preview-canvas/
  palette-view/

lib/

  quantization/
  dithering/
  image-processing/
  export/

types/

stores/

--------------------------------------------------
PERFORMANCE REQUIREMENTS
--------------------------------------------------

- All processing local
- Target generation under 2 seconds
- Support images up to 20MB
- Prevent UI freezing
- Use Web Workers for heavy image processing if necessary
- Minimize memory usage

--------------------------------------------------
QUALITY REQUIREMENTS
--------------------------------------------------

- Fully typed TypeScript
- No any types
- Clean architecture
- Responsive design
- Dark mode support
- Accessible UI
- Production-ready code
- Modern UI using shadcn/ui
- Clear loading states
- Error handling
- Empty states

Generate complete application structure, components, utilities, image-processing algorithms, and implementation code necessary to build the entire application.