uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    // Displacement
    vec3 newPositioin = position;
    float displacementIntensity = texture(uDisplacementTexture,uv).r;
    displacementIntensity = smoothstep(0.1,0.3,displacementIntensity);
    vec3 displacement = vec3(
        cos(aAngle) * 0.3,
        sin(aAngle) * 0.3,
        1.0
    );
    displacement = normalize(displacement);

    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    newPositioin += displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPositioin, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture
    float pictureIntensity = texture(uPictureTexture,uv).r;

    // Point size
    gl_PointSize = 0.153 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = vec3(pow(pictureIntensity,2.0));
}