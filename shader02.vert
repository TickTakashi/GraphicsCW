/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

////////////////
//exercise 2
uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

out vertexData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
}vertex;

/////////////

void main()
{
  vertex.pos = vec3(gl_ModelViewMatrix * gl_Vertex);
  vertex.normal = normalize(gl_NormalMatrix * gl_Normal);
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
  vertex.color = vec4(1.0,0.0,0.0,1.0);

  if(shader == 1)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.1 Gouraud shading here
    ///////////////////////////////////////////////////
    vec3 lightvec = -vertex.pos + gl_LightSource[0].position.xyz;
    float d = length(lightvec);
    lightvec = normalize(lightvec);
    vec3 camvec = normalize(vertex.pos);
    vec3 reflectvec = reflect(lightvec, vertex.normal);

    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
      + gl_LightSource[0].linearAttenuation * d
      + gl_LightSource[0].quadraticAttenuation * d * d);

    float u = 0.3;

    vec4 ia = ambientColor;
    vec4 id = attenuation * diffuseColor * max(dot(vertex.normal, lightvec), 0);
    vec4 is = attenuation * specularColor * pow(max(dot(reflectvec, camvec), 0),
      u * specularExponent);
    vertex.color = ia + id + is;
    ///////////////////////////////////////////////////
  }
}
