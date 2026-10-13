# Sunlight and camera controls

The user corrected the plan orientation: its top edge is WEST. World +X is north (plan right), +Z east (plan down), −X south (plan left), and −Z west (plan up). Astronomical azimuth remains clockwise from true north; sun vectors and the on-model north marker use this corrected basis.
Location: Harrison town center, New Jersey, 40.74642° N, 74.1571° W (Apple Maps place listing https://maps.apple.com/place?auid=6577621005744080330). This is a town-level location, not a surveyed apartment coordinate.

Solar azimuth, geometric elevation, equation of time, and approximate atmospheric refraction use the NOAA/Meeus equations. Reference: https://gml.noaa.gov/grad/solcalc/calcdetails.html and https://gml.noaa.gov/grad/solcalc/solareqns.PDF . UTC Julian time avoids browser time-zone dependence. The slider spans the actual elapsed minutes between two Harrison midnights (23, 24 or 25 hours); Intl's America/New_York rules handle DST. Sunrise/sunset find geometric center altitude −0.833°. Solar noon is sampled to one minute. Calculation is intended for 2000–2100.

Rendering is a clear-sky visualization, not a calibrated illuminance/energy simulation: light intensity, color and sky bounce are illustrative. Full-height opaque walls, window frames, a closed exterior entry door and an invisible ceiling block direct sunlight even in cutaway view. Interior doors are open. Windows transmit sunlight without glass attenuation. Neighboring buildings, balcony overhangs, trees, clouds, glass transmission, terrain and multiple diffuse bounces are not modeled. Wall/window heights and materials are inferred from the screenshot. The apartment has north, northwest and west-facing modeled openings.

W/S move toward/away from the camera's ground-plane heading; A/D move laterally. Position and orbit target translate together, preserving angle. Holding Shift increases speed. Movement is time-based, diagonal speed normalized, stops on blur or text input, and is available only in 3D.

## Furniture lighting

Lighting presets include a 10 × 10 × 12-inch mushroom desk lamp, an 18 × 18 × 62-inch floor lamp, an 18-inch paper globe, an 18 × 18 × 24-inch side table, and a 36-inch-tall table/lamp combination. All dimensions are editable estimates. The mushroom lamp automatically rests on a supporting table, desk, cabinet, or kitchen worktop beneath its complete footprint; manual base height is also available. A paper lantern defaults to a 12-inch ceiling drop.

Each fixture has one warm point light, inverse-square falloff, emissive shade, and a 512-pixel shadow map; full walls and ceiling block these lights too. Shades do not occlude their own source. Fixture brightness (0–200%) and 1800–6500 K approximate warmth are independent of the sun. The master switch preserves individual settings. Light settings persist in saved arrangements and JSON exports. Eight fixtures per layout bound graphics load. Night jumps to two hours after sunset for the selected date. Brightness is artistic, not a photometric or lux calculation, and indirect light bouncing between surfaces is not modeled.
