/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

in fragmentData
{
  vec3 vpos;
  vec3 normal;
  vec4 color;
}frag;

///////////////

void main()
{
  vec4 outcol = frag.color;

  if(shader == 2)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.2 Phong shading here
    ///////////////////////////////////////////////////
    vec3 lightvec = -frag.vpos + gl_LightSource[0].position.xyz;
    float d = length(lightvec);
    lightvec = normalize(lightvec);
    vec3 camvec = normalize(frag.vpos);
    vec3 reflectvec = reflect(lightvec, frag.normal);

    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
      + gl_LightSource[0].linearAttenuation * d
      + gl_LightSource[0].quadraticAttenuation * d * d);

    float u = 0.3;

    vec4 ia = inter.colour;
    vec4 id = attenuation * diffuseColor * max(dot(frag.normal, lightvec), 0);
    vec4 is = attenuation * specularColor * pow(max(dot(reflectvec, camvec), 0),
      u * specularExponent);
    outcol = ia + id + is;
    ///////////////////////////////////////////////////
  }

  if(shader == 3)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.3 toon shading here
    ///////////////////////////////////////////////////
    vec3 lightvec = -frag.vpos + gl_LightSource[0].position.xyz;
    float d = length(lightvec);

    float f = dot(lightvec / d, frag.normal / length(frag.normal));
    if (f > 0.98) {
      outcol = vec4(0.8, 0.8, 0.8, 1.0);
    } else if (f > 0.5) {
      outcol = vec4(0.8, 0.4, 0.4, 1.0);
    } else if (f > 0.25) {
      outcol = vec4(0.6, 0.2, 0.2, 1.0);
    } else {
      outcol = vec4(0.1, 0.1, 0.1, 1.0);
    }

    ///////////////////////////////////////////////////
  }

  gl_FragColor = outcol;
}
