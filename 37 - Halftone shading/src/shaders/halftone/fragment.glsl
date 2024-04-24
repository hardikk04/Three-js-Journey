uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;
uniform float uLightRepetitions;
uniform vec3 uLightColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;

vec3 halfton(
    vec3 color,
    float repetition,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
)
{
    float intensity = dot(normal,direction);
    intensity = smoothstep(low,high,intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetition;
    uv = mod(uv,1.0);

    float point = distance(uv,vec2(0.5));
    point = 1.0 - step(0.5 * intensity,point);

    return mix(color,pointColor,point);
}

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    light += ambientLight(
        vec3(1.0),      // Light Color
        1.0             // Light Intensity
    );

    // Directional Light
    light += directionalLight(
        vec3(1.0,1.0,1.0),    // Directional Light
        1.0,                  // Light intensity
        normal,               // Normal
        vec3(1.0,1.0,0.0),    // Light position
        viewDirection,        // View direction
        1.0                  // Specular power
    );

    color *= light;

    // Halftone
    color = halfton(
        color,                 // Input color
        uShadowRepetitions,    // Repetitions
        vec3(0.0, - 1.0, 0.0), // Direction
        - 0.8,                 // Low
        1.5,                   // High
        uShadowColor,          // Point color
        normal                 // Normal
    );

    color = halfton(
        color,                // Input color
        uLightRepetitions,    // Repetitions
        vec3(1.0, 1.0, 0.0),  // Direction
        0.5,                  // Low
        1.5,                  // High
        uLightColor,          // Point color
        normal                // Normal
    );

   

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}