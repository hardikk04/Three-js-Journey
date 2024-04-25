uniform sampler2D uSunTexture;

varying vec2 vUv;

void main()
{
    vec3 color = texture(uSunTexture,vUv).rgb;
    gl_FragColor = vec4(color,1.0);
}