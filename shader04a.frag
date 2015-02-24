/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform sampler2D textureImage;

in fragmentData
{
  vec3 vpos;
  vec3 normal;
  vec4 color;
  //Exercise 4:
  vec4 texCoords;
}frag;

///////////////

void main()
{
  //texture information
  vec4 tex_col = texture2D(textureImage, frag.texCoords.st);

  //////////////////////////////////////////////////////////
  //TODO Exercise 04a: integrate the texture information 
  // into a Phong shader (e.g. into the one from Exercise 2)
  //////////////////////////////////////////////////////////
  float bump_strength = 5.0;
  vec3 bump_pos = frag.vpos;// + frag.normal * (tex_col.b - (tex_col.r + tex_col.g)) * bump_strength;
  vec3 lightvec = -bump_pos + gl_LightSource[0].position.xyz;
  float d = length(lightvec);
  lightvec = normalize(lightvec);
  vec3 camvec = normalize(bump_pos);
  vec3 reflectvec = reflect(lightvec, frag.normal);

  float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
    + gl_LightSource[0].linearAttenuation * d
    + gl_LightSource[0].quadraticAttenuation * d * d);

  float u = 0.3;

  vec4 ia = tex_col;
  vec4 id = attenuation * diffuseColor * max(dot(frag.normal, lightvec), 0);
  vec4 is = attenuation * specularColor * pow(max(dot(reflectvec, camvec), 0),
    u * specularExponent);
  gl_FragColor = ia + id + is;
  //////////////////////////////////////////////////////////
}
