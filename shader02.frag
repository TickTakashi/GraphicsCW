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
  vec3 pos;
  vec3 normal;
  vec4 color;
}frag;

///////////////

void main()
{
  vec4 outcol = frag.color;
  vec3 light_vec = normalize(-frag.pos + vec3(gl_ModelViewMatrix * gl_LightSource[0].position));
 
  if(shader == 2)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.2 Phong shading here
    ///////////////////////////////////////////////////
    // Set u
    float u = 0.3; 

    // Calculate light vectors.
    vec3 reflected_vec = reflect(-light_vec, frag.normal);

    // Calculate camera vector.
    // Note: After ModelView, the camera is the origin, and therefore the
    // view direction vector for this frag.is just its normalized position.
    vec3 camera_view = -normalize(frag.pos);

    // Calculate distance to light source.
    float dist = distance(frag.pos, vec3(gl_ModelViewMatrix * gl_LightSource[0].position));

    // Calculate Attenuation
    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation +
      gl_LightSource[0].linearAttenuation * dist +
      gl_LightSource[0].quadraticAttenuation * dist * dist);

    // Calculate resulting color
    vec4 ia = ambientColor;
    vec4 id = attenuation * diffuseColor * max(dot(frag.normal, light_vec), 0); 
    vec4 is = attenuation * specularColor * pow(max(dot(reflected_vec, camera_view), 0), u * specularExponent);
     
    outcol = ia + id + is;
    ///////////////////////////////////////////////////
  }

  if(shader == 3)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.3 toon shading here
    ///////////////////////////////////////////////////
    float i_f = dot(light_vec / length(light_vec), frag.normal / length(frag.normal));

    if (i_f > 0.98) {
      outcol = vec4(0.8, 0.8, 0.8, 1.0);
    } else if (i_f > 0.5) {
      outcol = vec4(0.8, 0.4, 0.4, 1.0);
    } else if (i_f > 0.25) { 
      outcol = vec4(0.6, 0.2, 0.2, 1.0);
    } else {
      outcol = vec4(0.1, 0.1, 0.1, 1.0);
    }
    ///////////////////////////////////////////////////
  }

  gl_FragColor = outcol;
}
