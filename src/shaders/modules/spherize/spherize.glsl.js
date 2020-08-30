// Based on https://www.shadertoy.com/view/tl2BRz by pschroen

export default /* glsl */`
/**
 * This is a port to GLSL of the GEGL Spherize image processing operation.
 *
 * Author: pschroen
 *
 * GEGL Spherize:
 *   http://gegl.org/operations/gegl-spherize.html
 *   https://docs.gimp.org/2.10/en/gimp-filter-spherize.html
 *
 * GEGL is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * GEGL is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with GEGL; if not, see <https://www.gnu.org/licenses/>.
 *
 * Copyright (C) 2017 Ell
 */

#define G_PI    3.1415926535897932384626433832795028841971693993751
#define G_PI_2  1.5707963267948966192313216916397514420985846996876
#define EPSILON 1e-10

vec4 spherize(sampler2D image, vec2 uv, vec2 center, vec2 direction, float angle_of_view, float curvature, float amount) {
    direction = 2.0 * direction;

    float coangle_of_view_2 = max(180.0 - angle_of_view, 0.01) * G_PI / 360.0;
    float focal_length      = tan(coangle_of_view_2);
    float curvature_sign    = curvature > 0.0 ? 1.0 : -1.0;
    float cap_angle_2       = abs(curvature) * coangle_of_view_2;
    float cap_radius        = 1.0 / sin(cap_angle_2);
    float cap_depth         = curvature_sign * cap_radius * cos(cap_angle_2);
    float factor            = abs(amount);

    float f     = focal_length;
    float f2    = f * f;
    float r     = cap_radius;
    float r_inv = 1.0 / r;
    float r2    = r * r;
    float p     = cap_depth;
    float f_p   = f + p;
    float f_p2  = f_p * f_p;
    float f_pf  = f_p * f;
    float a     = cap_angle_2;
    float a_inv = 1.0 / a;
    float sgn   = curvature_sign;

    bool perspective = angle_of_view > EPSILON;
    bool inverse     = amount < 0.0;

    float x = direction.x * (uv.x - center.x);
    float y = direction.y * (uv.y - center.y);

    float d2 = x * x + y * y;

    if (d2 > EPSILON && d2 < 1.0 - EPSILON) {
        float d = sqrt(d2);
        float src_d = d;

        if (!inverse) {
            float d2_f2 = d2 + f2;

            if (perspective)
                src_d = (f_pf - sgn * sqrt(d2_f2 * r2 - f_p2 * d2)) * d / d2_f2;

            src_d = (G_PI_2 - acos(src_d * r_inv)) * a_inv;
        } else {
            src_d = r * cos(G_PI_2 - src_d * a);

            if (perspective)
                src_d = f * src_d / (f_p - sgn * sqrt(r2 - src_d * src_d));
        }

        if (factor < 1.0)
            src_d = d + (src_d - d) * factor;

        uv.x = direction.x > 0.0 ? center.x + src_d * x / (direction.x * d) : uv.x;
        uv.y = direction.y > 0.0 ? center.y + src_d * y / (direction.y * d) : uv.y;
    }

    return texture2D(image, uv);
}

vec4 spherize(sampler2D image, vec2 uv, vec2 center, vec2 direction) {
    return spherize(image, uv, center, direction, 0.0, 1.0, 1.0);
}

vec4 spherize(sampler2D image, vec2 uv, vec2 direction) {
    return spherize(image, uv, vec2(0.5, 0.5), direction, 0.0, 1.0, 1.0);
}

vec4 spherize(sampler2D image, vec2 uv) {
    return spherize(image, uv, vec2(0.5, 0.5), vec2(1.0, 1.0), 0.0, 1.0, 1.0);
}
`;
