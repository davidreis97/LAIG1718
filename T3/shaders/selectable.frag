precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float colorScale;

void main() {
	gl_FragColor = texture2D(uSampler,vTextureCoord) * vec4(1.0,1.0 * (1.0-colorScale),1.0 * (1.0-colorScale),1.0);	
}