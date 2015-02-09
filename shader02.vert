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
   
    // Set u
    float u = 0.3; 

    // Calculate light vectors.
    vec3 light_vec = normalize(-vertex.pos + vec3(gl_ModelViewMatrix * gl_LightSource[0].position));
    vec3 reflected_vec = normalize(2 * dot(vertex.normal, light_vec) * vertex.normal - light_vec);

    // Calculate camera vector.
    // Note: After ModelView, the camera is the origin, and therefore the
    // view direction vector for this vertex is just its normalized position.
    vec3 camera_view = normalize(vertex.pos);

    // Calculate distance to light source.
    float dist = distance(vertex.pos, vec3(gl_ModelViewMatrix * gl_LightSource[0].position));

    // Calculate Attenuation
    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation +
      gl_LightSource[0].linearAttenuation * dist +
      gl_LightSource[0].quadraticAttenuation * dist * dist);

    // Calculate resulting color
    vec4 ia = ambientColor;
    vec4 id = attenuation * diffuseColor * dot(vertex.normal, light_vec); 
    vec4 is = attenuation * specularColor * pow(dot(reflected_vec, camera_view), u * specularExponent);
    
    vertex.color = ia + id + is;
    ///////////////////////////////////////////////////
  }
}
