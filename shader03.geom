/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility
#extension GL_ARB_geometry_shader4 : enable

layout (max_vertices = 72) out;

const float pi = 3.14159265359;

////////////////
uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform int level;
uniform float time;

in vertexData
{
	vec3 pos;
	vec3 normal;
	vec4 color;
}vertices[];

out fragmentData
{
	vec3 vpos;
	vec3 normal;
	vec4 color;
}frag;


///////////////////////////////////////////////////////
//pseudo random helper function
///////////////////////////////////////////////////////
float rnd(vec2 x)
{
	int n = int(x.x * 40.0 + x.y * 6400.0);
	n = (n << 13) ^ n;
	return 1.0 - float( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0;
}


///////////////////////////////////////////////////////
//TODO add code for exercise 3 Geometry generation here
///////////////////////////////////////////////////////
void produceVertex(float beta, float gamma)
{
  ///////////////////////////////////////////////////////
  //TODO implement for subdivision
  ///////////////////////////////////////////////////////
  float alpha = (1 - beta) - gamma;
  vec4 a = gl_in[0].gl_Position;
  vec4 b = gl_in[1].gl_Position;
  vec4 c = gl_in[2].gl_Position;
  vec4 new_position = alpha * a + beta * b + gamma * c;
  
  frag.vpos = alpha * vertices[0].pos + beta * vertices[1].pos + gamma * vertices[2].pos;
  frag.normal = alpha * vertices[0].normal + beta * vertices[1].normal + gamma * vertices[2].normal;
  frag.color = alpha * vertices[0].color + beta * vertices[1].color + gamma * vertices[2].color;

  gl_Position = new_position;
  EmitVertex();
  ///////////////////////////////////////////////////////
}
///////////////////////////////
void main()
{
  ///////////////////////////////////////////////////////
  //TODO replace pass through shader with solution
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  if (level >  0 && level <= 2) {
    int ps = 1 << level;
    int x;
    int y;

    for(x = 0; x < ps; x++) {
      for(y = 0; y < ps - x; y++) {
        // Create a point at barycentric co-ordinate
        // x/ps, y/ps 
        produceVertex(float(x)/float(ps), float(y)/float(ps));

        // These three lines exist only to match the topology of the reference
        // I am unsure how to produce the same topology otherwise.
        produceVertex(float(x+1)/float(ps), float(y)/float(ps));
        produceVertex(float(x)/float(ps), float(y+1)/float(ps));
        EndPrimitive();
      }
    }
  } else {
    float slow_factor = 0.1;
    int i;
    // Expanding Teapot!
    for(i = 0; i < gl_in.length(); i++)
    {
      frag.vpos = vertices[i].pos;
      frag.normal = vertices[i].normal;
      frag.color = vertices[i].color;
      vec4 pos = gl_in[i].gl_Position;
      gl_Position = pos + time * slow_factor * vec4(vertices[i].pos, 0);
      EmitVertex();
    } 
    EndPrimitive();
  }   
}
