uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;

uniform float uWrapPositionFrequency;
uniform float uWrapTimeFrequency;
uniform float uWrapStrength;

attribute vec4 tangent;

varying float vWobble;

#include ../includes/simplexNoise4d.glsl

float getWobble(vec3 position)
{
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
        position * uWrapPositionFrequency,
        uTime * uWrapTimeFrequency
    )) * uWrapStrength;


    return simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency,       // XYZ
        uTime * uTimeFrequency             // W
    )) * uStrength;
}

void main()
{
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighbours positions
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    // Wobble
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    // Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA,toB);

    // Varying
    vWobble = wobble / uStrength;
}