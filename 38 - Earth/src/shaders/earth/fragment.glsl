uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudTexture;
uniform vec3 uSunDirection;
uniform float uCloudIntensity;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;
uniform float uAtmosphereIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    vec3 uSunDirection = vec3(0.0,0.0,1.0);
    float sunOrientation = dot(uSunDirection,normal);


    // Day / Night texture
    float dayMix = smoothstep(-0.25,0.5,sunOrientation);
    vec3 dayColor = texture(uDayTexture,vUv).rgb;
    vec3 nightColor = texture(uNightTexture,vUv).rgb;
    color = mix(nightColor,dayColor,dayMix);

    // Specular cloud color
    vec2 specularCloudColor = texture(uSpecularCloudTexture,vUv).rg;
    float cloudsMix = smoothstep(uCloudIntensity,1.0,specularCloudColor.g);
    cloudsMix *= dayMix;
    color = mix(color,vec3(1.0),cloudsMix);
    
    // Fresnel
    float fresnel = dot(viewDirection,normal) + 1.0;
    fresnel = pow(fresnel,uAtmosphereIntensity);
    

    // Atmoshpere
    float atmoshpereDayMix = smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmoshpereColor = mix(uAtmosphereTwilightColor,uAtmosphereDayColor,atmoshpereDayMix);
    color = mix(color,atmoshpereColor,fresnel * atmoshpereDayMix);

    // Specular
    vec3 reflection = reflect(- uSunDirection, normal);
    float specular =- dot(reflection,viewDirection);
    specular = max(specular,0.0);
    specular = pow(specular,32.0);
    color += specular;
    specular *= specularCloudColor.r;

    vec3 specularColor = mix(vec3(1.0),atmoshpereColor,fresnel);
    color += specular * specularColor;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}