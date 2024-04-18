uniform float uTime;
varying vec2 vUv;

#include ../includes/rotate2D.glsl;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    modelPosition.z -= sin(modelPosition.x + uTime) * cos(modelPosition.y + uTime) * 0.3;
    modelPosition.y -= cos(modelPosition.x + uTime) * sin(modelPosition.z + uTime) * 0.4;
    // modelPosition.y = cos(modelPosition.y + uTime);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    vUv = uv;
}