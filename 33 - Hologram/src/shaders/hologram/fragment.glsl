uniform float uTime;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    // Normal
    vec3 normal = normalize(vNormal);

    if(!gl_FrontFacing)
    {
        normal *= -1.0;
    }

    // Strips
    float strips = mod((vPosition.y - uTime * 0.02) * 20.0 , 1.0);
    strips = pow(strips,3.0);

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection,normal) + 1.0;
    fresnel = pow(fresnel,2.0);

    // Fall off
    float fallOff = smoothstep(0.8,0.0,fresnel);

    // Holographic
    float holographic = fresnel * strips;
    holographic += fresnel * 1.25;
    holographic *= fallOff;

    // mixing the color
    vec3 color = mix(uInnerColor,uOuterColor,fallOff);

    // Final color
    gl_FragColor = vec4(color,holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}