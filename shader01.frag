/************************************************************************/
/*    Graphics 317 coursework exercise 01                               */
/*    Author: Bernhard Kainz                                            */
/*    Nothing to be done in this file for this exercise                 */
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


void main()
{
  vec4 outcol = frag.color;

  gl_FragColor = outcol;
}
