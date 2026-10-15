# ドンドラ！危険予測ドライブ

Three original mobile-first hazard-perception driving exercises. Static ES modules. All three courses use locally vendored Three.js 0.180.0 with original 3D models, lighting, shadows, animated child, cockpit and camera controls. Canvas 2D remains available as an explicit comparison and compatibility fallback. No external runtime CDN, fonts, media or analytics. Desktop and touch controls. Automatic steering, hold-to-accelerate/brake, click a visual hazard, pause/resume, per-course feedback and browser-local best records. Japanese interface.

## Files

- `dist/index.html`: interface and teaching references
- `dist/style.css`: responsive styling using the existing app's blue/navy/off-white palette
- `dist/engine.mjs`: deterministic physics, events, scoring and course definitions
- `dist/renderer.mjs`: original procedural illustrations and perspective projection
- `dist/app.mjs`: touch/keyboard controls, UI, optional tones and local progress

`node test-engine.mjs` checks safe/unsafe completion, detection, pause, brake priority, stopping position, intersection observation and frame-rate consistency. `node --check dist/app.mjs` and the other modules check syntax.

This is a separate prototype. The existing karimen-study production app has not been modified. To integrate later, copy `dist` under a dedicated path and add an entry point in the main application. Storage is isolated under `dondora-hazard-drive-v1`; no existing learning records are accessed or overwritten. Guided and challenge scores are separate. Source artwork and scenario implementations are original, not extracted from JAF videos or the user's existing question images.

## Learning scope

Each exercise ends after a safe stop and observation of the hazard passing. The intersection requires a stop near its marked line and explicit left/right checks. It does not simulate a full drive through an intersection. The simple game dynamics and score are not a representation of real stopping distances, licensing test criteria, or a driving fitness assessment.

Learning references (consulted 2026-10-15):
- https://jaf.or.jp/common/safety-drive/online-training/risk-prediction
- https://jaf.or.jp/common/news/2026/20260618-001
- https://www.npa.go.jp/bureau/traffic/oudanhodou/info.html
- https://www.npa.go.jp/news/release/2025/rulebook.pdf

## Verification limit

Browser automation is unavailable in the current managed environment. Physics tests, DOM interaction checks, module syntax and direct Canvas render inspection are available. Real iPhone/Safari layout, gesture, audio and private-link sign-in still need device confirmation.


## 0.2 — First 3D course

- Course 01 and its home/result imagery use one shared WebGL2 renderer and an original Japanese residential street.
- True geometry occlusion hides the child behind the delivery van. Animation follows the existing deterministic hazard timeline.
- 2D/3D comparison, drag-to-look and left/front/right buttons; light mode disables shadows and reduces pixel ratio.
- A WebGL initialization failure leaves gameplay available in explicit 2D compatibility mode. Context loss pauses the game and switches to 2D.
- Standard mode caps pixel ratio at 1.5, uses one 1024px shadow map, merges static geometry by material, and has approximately 119 meshes / 59k triangles.
- Three.js is pinned, self-hosted, and retains its MIT license in `dist/vendor/THREE-LICENSE.txt`. Run `node scripts/vendor.mjs` after installing dependencies.
- `node test-world.mjs` verifies actual raycast occlusion, child emergence, camera movement, finite geometry, and rendering budgets. Engine tests and DOM flow tests also pass, including simulated WebGL unavailability.
- Direct SVG projection checked 3D model placement and the camera composition; it does not verify GPU lighting, shadows or shaders. The current environment has no supported browser-control capability. Live WebGL rendering and iPhone/Safari performance remain unverified.

## 0.3 — Three consistent 3D courses

- Added a striped pedestrian crossing, waiting adult with animated limbs, tactile paving and crossing signs.
- Added a cross street, stop line, stop sign, corner building that physically occludes a detailed bicycle and rider.
- Shared houses, cockpit, materials, soft shadows, camera controls and lightweight quality mode across all courses.
- Home thumbnails and result scenes now use the corresponding 3D world. One WebGL renderer serves all three cached scenes.
- The 3D left/right camera buttons record intersection observations only after a qualified stop; checks and camera reset on retry.
- Published through GitHub Pages. Browser GPU rendering/performance is not verified in this execution environment.

## 0.4 — Visual rebuild

- Rounded vehicle body with distinct paint, seals, glazing, alloy wheels, lamps, wipers and door details.
- Articulated people with faces, collars, backpacks, elbow/knee movement and a pedalling cyclist.
- Varied flat/gabled roofs, facade siding, porch fittings, layered tree canopies, paving joints and manholes.
- Gradient sky, cloud banks, procedural daylight reflections, asphalt grain, contact shadows, crosswalk pictograms and vertical road lettering.
- Lower cockpit, detailed steering wheel and speed-linked instrument texture. Compact HUD leaves the physical cockpit visible.
- Static geometry and cloud batches limit the untextured scenes to 147/148/196 meshes and approximately 103k/103k/108k triangles. Lightweight mode remains available.
- Gameplay, scoring, storage keys and hazard locations unchanged. Versioned module and stylesheet URLs avoid mixing with v0.3.

Validation: existing 12 engine checks and 3-course geometry/occlusion checks pass. Local DOM flow tests pass with a stub renderer; canvas texture generation and instrument updates verified separately. SVG projections inspect geometry placement only. Actual WebGL material/shadow output, touch ergonomics and iPhone frame rate are not verified in this environment; no claim of a measured 100/100 visual score is made.

## 0.5 — Contact animation, driving audio and connected free drive

- A single 255 m free-drive route places the original three encounters at 88, 154 and 220 m, with one camera and no scene-loading cuts.
- Actual longitudinal/lateral contact triggers a non-graphic ballistic tumble. Free drive awards 100/200/300 contact-combo points; passing an encounter without contact resets the streak. Records use a separate arcade key, never a learning score.
- Learning exercises retain safe stopping and capped failure scores; missed stopping lines can now lead to an actual contact animation before the failure result.
- Synthesized engine harmonics respond to speed/throttle; filtered tire noise responds to braking. Start/resume unlock Web Audio through a user gesture. Mute, pause, exit and tab blur silence the motor.
- Geometry, contact/combo logic at 30/60/120 Hz, safe/unsafe lessons, pause, stationary non-contact, retry, result storage and DOM control wiring checked. Web Audio scheduling verified with mocked audio nodes, not audible device playback. Real WebGL and iPhone audio/performance remain unverified.
