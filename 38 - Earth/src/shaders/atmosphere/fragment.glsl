uniform vec3 uSunDirection;
uniform float uCloudIntensity;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;
uniform float uAtmosphereIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(uSunDirection,normal);

    // Atmoshpere
    float atmoshpereDayMix = smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmoshpereColor = mix(uAtmosphereTwilightColor,uAtmosphereDayColor,atmoshpereDayMix);
    color = mix(color,atmoshpereColor,atmoshpereDayMix);
    color += atmoshpereColor;

    // Alpha
    float edgeAlpha = dot(viewDirection,normal);
    edgeAlpha = smoothstep(0.0,0.5,edgeAlpha);

    float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation);

    color = vec3(dayAlpha);

    float alpha = edgeAlpha * dayAlpha;

    // Final color
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}