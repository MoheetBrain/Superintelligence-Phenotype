# Precision correction audit · 12 September 2026

Baseline: reconstruction `db0d4ea`, retained in `screenshots/precision/before-*.png`. Audit recorded before geometry edits. The supplied standing dark photograph is primary geometry evidence. The supplied white lifestyle photograph has a different covered torso/shoulder treatment, a bent pose and perspective foreshortening: use it for satin pearl/black material distribution only. Do not average its segment ratios into the hard-shell model.

## Image measurements

The standing screenshot is 1086×1836. Approximate floor contact y = 1695, crown y = 165, centerline x = 655, giving H = 1530 pixels. Manual landmark picks have roughly ±4–12 px uncertainty, depending on occlusion. They describe a projected standing photograph, not manufacturing dimensions. Measurements and target parameters are stored in `robot-reference-measurements.json`.

The previously inspected public front photo is the same underlying image, not a second independent measurement. Public torso/head, hand, foot and standing three-quarter details supplement it for depth and assembly interpretation. Rear mechanisms not visible in these views remain inferred. Reference URLs are recorded in the machine-readable file; none of the reference images are application assets.

| Region | Reference appearance | Baseline appearance | Exact discrepancy | Required correction | Priority |
| --- | --- | --- | --- | --- | --- |
| Global silhouette | Narrow long trunk, high wrists, long lower legs | Wide trunk, low hands, low knees | Trunk width ~0.137H vs 0.172; knee ~0.296H vs 0.281 | Narrow chest ~18%; raise knee and wrist landmarks | P0 |
| Head | Pod height ~0.130H, width ~0.081H | 0.124H × 0.083H, round lower end | Too short/wide, egg-like lower closure | Lengthen 5%, narrow 2%, flatten lower closure | P0 |
| Visor | Continuous front glass with wide upper face and tapered lower face | Uniform half-shell wrapping the pod | Insufficient boundary definition, uniformly oval | Reshape lower contour and wrap boundary; retain smoked glass | P0 |
| Head side housing | Flush side/rear treatment | Projecting small blocks | Headphone-like silhouette protrusions | Nearly flush recessed temple inserts | P1 |
| Head/neck relationship | Head nested over sleeve, torso top ~0.848H | Exposed narrow stalk | Too much visible cylindrical neck | Flared short sleeve tucked into head and torso | P0 |
| Neck | Dark textured transition | Smooth small capsule | No flared base/controlled rear slope | Custom flared profile; matte material | P1 |
| Torso front | Broad flat center, controlled radiused edges | Barrel highlights and convex center | Front curvature too strong | Flatter cross-section with distinct front/rear depth | P0 |
| Torso side | Tall oval recessed side boundary | Protruding thin side plate | Cavity depth and rib field insufficient | Recessed vent bed with perimeter collar | P0 |
| Torso width | ~0.137H near middle | 0.172H | ~26% wider in baseline projected-width comparison | Set primary width ~0.141H; verify clay | P0 |
| Torso height | ~0.257H | 0.254H | Height close; width makes it look short | Retain ~0.258H while narrowing | P0 |
| Torso lower edge | Defined almost flat hem over opening | Rounded capsule bottom | Excessively soft closure | Thin bevelled lower hem and dark undercut | P0 |
| Side vents | Dense black slats around shoulder drive | Sparse mostly hidden fins | Wrong exposure and cavity boundary | Visible slatted ellipse below drive; black inset | P1 |
| Chest seams/fasteners | Sparse flush screws and lower service panel | Continuous outlined perimeter dominates | Need lower panel distinction, less outline contrast | Subtle raised/recessed panel following actual surface | P2 |
| Waist | Narrow central coupling with visible side links | Broad solid rounded coupling | Too much solid volume | Narrow pedestal, short rotary collar, slender links | P0 |
| Pelvis | Two distinct cylinders, recessed bridge center | One padded rounded bar | Missing actuator breaks and central recess | Separate left/right housings, slim stepped bridge | P0 |
| Hip joints | Downward pivots and dark inner space above thigh cuffs | Solid capsules hanging under bar | No readable vertical articulation | Rotary pivots, open cuff transition and inset core | P0 |
| Left shoulder | Angled circular face inset in outer shell | Large disc pointed straight forward | Face dominates front silhouette | Smaller face, angled outward, partial collar occlusion | P0 |
| Right shoulder | Same mirrored hardware | Same front-disc defect | Same geometry issue | Mirror the corrected shared construction | P0 |
| Upper arms | Flat-sided taper, dark inner/rear insert | Soft capsule | End closures too round, cross-section too circular | Bevelled loft with flatter faces and rear insert | P1 |
| Elbows | Layered side cap, hinge and mounting collar | Black cylinder and blank grey cap | Flat cap lacks architecture | Inset cap center, yoke and forearm collar | P1 |
| Forearms | Taper from elbow to compact wrist | Long almost uniform shell | Wrist too low; taper obscured by rounded ends | Raise wrist to ~0.512H, defined proximal/distal sections | P0 |
| Wrists | Small rotational element with open mounting linkage | Bulky coupler over rectangular palm | No visible mounting opening | Compact coupler plus perforated mounting bridge | P1 |
| Palms | Substantial sculpted body, inward-facing neutral palms | Front-facing square pad | Too small overall, wrong orientation | Enlarge palm and rotate inward with same pose on A/B | P0 |
| Thumbs | Long offset opposable digit | Short angled pair | Too short relative to palm | Lengthen two segments, preserve relaxed separation | P1 |
| Fingers | Long flattened phalanges, restrained joint gaps | Short rounded segments with bright joints | Rake-like uniform rows and specular emphasis | Broader shaped segments, graduated lengths, darker small pivots | P0 |
| Thighs | Upper cuff, darker tapered lower shell | Single swollen capsule | Missing cuff and front/rear distinction | Separate cuff, flatter shell, dark inner/back insert | P0 |
| Knees | Lateral actuators, slit-like front gap | Broad rounded front hinge | Front housing too bulky and knee too low | Compact yoke, lateral disc, raise knee to ~0.296H | P1 |
| Shins | Flat front, deep upper calf, substantial lower section | Smooth narrowing cone | Lower width too small; no ankle cutout | Nonlinear profile, deeper rear, open front ankle arch | P0 |
| Ankles | Wide hinge and visible structural links | Tiny stem | Width/depth undersized | Enlarge hinge and two side links | P0 |
| Feet | Wedge vamp, defined heel, toe lip and ankle pocket | Smooth slippers | No designed layering or opening | Layered low shoe with heel cage and toe cap | P1 |
| Soles | Black substantial base, upturned heel/toe lips | Thin smooth sheet | Weak contact and no technical edge | Bevelled dark sole with heel/toe lips | P1 |
| Materials | Satin graphite limbs; only glass strongly glossy | Chrome-like streaks over all shells | Shell metalness and clearcoat too high | Lower metalness, raise roughness; isolate visor gloss | P0 |
| Lighting | Soft broad highlights and grounded feet | Pale washed stage, hard reflection streaks | Contrast/readability and foot contact weak | Softer fill/environment balance and local contact shadows | P1 |
| Rest pose | Palms inward, relaxed fingers, almost vertical limbs | Broad palms forward and symmetric rigid stance | Pose hides thumb silhouette and feels mannequin-like | Inward palm rotation, minimal elbow/foot offsets | P1 |
| Camera | Near-level product view with complete bodies | Public orbit permits extreme angles | Overhead/underbody views and overlay occlusion | Clamp public polar range/distance; preserve debug freedom | P1 |
| Callouts/state orb | An explanatory overlay, separate from hardware | Large ring and labels cover torso | Reads as reactor; hides changed geometry | Small idle anchor, offset labels and leaders; expand on drag | P0 |

## Iteration record

Append captured pass findings and corrections here after each visual review. Acceptance is based on inspected renders, not the existence of geometry functions.

### Pass 1 · clay silhouette

Inspected `pass-1a-front`, `pass-1a-three-quarter`, `pass-1a-side` at 1440×1000. The narrower flat trunk and revised head/wrist/knee landmarks remove the old barrel silhouette. Five largest remaining differences: missing recessed shoulder depth; elbow/wrist gaps without readable mounts; unarticulated space above thigh shells; ankle stems without broad side links; undifferentiated heel/vamp construction. Corrected these in the assembly pass with separate actuator collars, yokes, vertical hip pivots/cuffs, wider ankle bearings and a heel cage. The clay shader was also darkened so the shape review no longer depended on near-white reflections.

### Pass 2 · mechanical assembly

Inspected `pass-2a-front`, `pass-2a-three-quarter` and `pass-2a-side`; reviewed the rear continuation in the following full assembly render. Five largest remaining differences were the proud upper side rims, absent lower chest panel, old vent positions outside the narrowed trunk, closed shin hems and undifferentiated shoe soles. The rims were inset and shortened; the front panel now follows the chest vertices; a merged black rib field follows each cavity; the shin hem forms an ankle arch; shoes gained an extruded dark sole and separate toe cap. Wrist/forearm inserts were realigned to the raised wrist landmark.

### Pass 3 · industrial finish and assembled views

Inspected `pass-3a-front`, `pass-3a-three-quarter`, `pass-3a-side`, `pass-3a-back`, then the graphite and pearl renders. Five remaining issues corrected: side rims still projected above the shoulders (shortened again); the crown plate read as a small tab (inset into the rear crown); feet lacked local contact (four soft procedural shadow patches); the ankle opening retained a grey end-cap fan (removed); and distal forearm inserts read as large boxes (reduced and recessed). The satin PBR hierarchy and lower clearcoat distinguish shell, panel, joint, hand, vent and glass surfaces. Shared geometry remains below the 150,000-triangle per-body limit.

### Application integration

Idle state markers shrink to 28% of their previous size and expand for extraction/transfer. HTML callouts sit outside the torso with projected leaders; narrow-screen callouts move below the body. The public inspector can hide annotations without altering the demonstration state. Public polar orbit is limited to 55–120 degrees; development comparison remains unrestricted. Canonical captures include both side and both three-quarter views in the final set. The model remains an original approximation, with uncertain hidden construction recorded in the final report.

Final close-up corrections: the thigh cuffs now use open-ended lofts so their end caps do not intersect the thigh face; the ankle pocket has a minimal matte inner wall; the redundant distal forearm patch was removed. The rectangular drop target now uses its visible bounds with an 8 px touch tolerance. These changes were followed by focused picking and gesture regression checks.
