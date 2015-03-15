/************************************************************************/
/*    Graphics 317 coursework exercise 05                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/


#version 150 compatibility

in vec3 origin, dir, point;
out vec4 outcolour;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

const int raytraceDepth = 42;
const int numSpheres = 6;

struct Ray
{
  vec3 origin;
  vec3 dir;
};
struct Sphere
{
  vec3 centre;
  float radius;
  vec3 colour;
};
struct Plane
{
  vec3 point;
  vec3 normal;
  vec3 colour;
};

struct Intersection
{
  float t;        // the u value of the first hit
  vec3 point;     // hit point
  vec3 normal;    // normal
  int hit;
  vec3 colour;
};

////////////////////////////////////////////////////////////////////
// TODO Exercise 5: implement a simple geometry based ray tracing
// implement the functions in the follwing.
// In order to reach all points you need to implement at least one
// feature more than shown in the coursework description
// effects like refraction, scattering, caustics, soft hadows, etc.
// are possible.
////////////////////////////////////////////////////////////////////

void sphere_intersect(Sphere sph, Ray ray, inout Intersection intersect)
{
  float a = pow(length(ray.dir), 2.0);
  float b = 2.0 * dot(ray.dir, (ray.origin - sph.centre));
  float c = pow(length(ray.origin - sph.centre), 2.0) - pow(sph.radius, 2.0);

  float disc = pow(b, 2) - 4 * a * c;
  if (disc < 0) {
    // No Intersection.
  } else {
    // Hits once or twice, in either case we find the first hit.
    float u1 = (-b + sqrt(disc)) / (2 * a);
    float u2 = (-b - sqrt(disc)) / (2 * a);

    // this will always be the lowest positive case (To void ray calculations
    // for things in the opposite direction).
    float u = u2 > 0 && u1 > 0 ? min(u1, u2) : max(u1, u2);

    // They might both be negative, in which case there is no hit.
    if (u > 0 && (u < intersect.t || intersect.t < 0)) {
      intersect.point = ray.origin + u * ray.dir;
      intersect.normal = normalize(intersect.point - sph.centre);
      intersect.colour = sph.colour;
      intersect.t = u;
    }
  }
}

void plane_intersect(Plane pl, Ray ray, inout Intersection intersect)
{
  float checker_width = 0.33;

  float disc = dot(pl.normal, ray.dir);
  if (disc != 0) {
    float u = -dot(pl.normal, ray.origin - pl.point) / disc;
    if (u > 0 && (u < intersect.t || intersect.t < 0)) {
      intersect.point = ray.origin + u * ray.dir;
      intersect.normal = pl.normal;
      if ((int(floor(intersect.point.z / checker_width)) % 2) ==
          (int(floor(intersect.point.x / checker_width)) % 2)) {
        intersect.colour = pl.colour;
      } else {
        intersect.colour = vec3(1.0 - pl.colour.x, 1.0 - pl.colour.y, 1.0 - pl.colour.z);
      }
      intersect.t = u;
    }
  }
}

Sphere sphere[numSpheres];
Plane plane;
void Intersect(Ray r, inout Intersection i)
{
  int j;
  for (j = 0; j < sphere.length(); j++) {
    sphere_intersect(sphere[j], r, i);
  }

  plane_intersect(plane, r, i);
}

int seed = 0;
float rnd()
{
  seed = int(mod(float(seed)*1364.0+626.0, 509.0));
  return float(seed)/509.0;
}

vec3 computeShadow(in Intersection inter)
{
  float epsillon = 0.0001;
  vec4 totalColour = vec4(0, 0, 0, 0);
  int l;
  // TODO: Somehow incorporate all the light sources without it getting too
  // bright.
  for (l = 0; l < 1/*gl_LightSource.length() */; l++) {
    vec3 lightPos = gl_LightSource[l].position.xyz;

    Ray shadowRay;
    shadowRay.origin = inter.point;
    shadowRay.dir = normalize(-shadowRay.origin + lightPos);
    shadowRay.origin += shadowRay.dir * epsillon;

    Intersection sInter;
    sInter.t = -1;
    Intersect(shadowRay, sInter);

    if (sInter.t != -1 && sInter.t < length(-shadowRay.origin + lightPos)) {
      totalColour += vec4(0, 0, 0, 0);
    } else {
      vec3 lightvec = -inter.point + lightPos;
      float d = length(lightvec);
      lightvec = normalize(lightvec);
      vec3 camvec = normalize(inter.point);
      vec3 reflectvec = reflect(lightvec, inter.normal);
      float attenuation = 1.0 / (gl_LightSource[l].constantAttenuation
        + gl_LightSource[l].linearAttenuation * d
        + gl_LightSource[l].quadraticAttenuation * d * d);
      float u = 0.3;
      vec4 id = attenuation * vec4(inter.colour, 1) * max(dot(inter.normal, lightvec), 0);
      totalColour += id;
    }
  }

  return totalColour.xyz;
}

void main()
{
  //initial scene definition
  sphere[0].centre   = vec3(-2.0, 1.5, -3.5);
  sphere[0].radius   = 1.5;
  sphere[0].colour = vec3(0.8,0.8,0.8);
  sphere[1].centre   = vec3(-0.5, 0.0, -2.0);
  sphere[1].radius   = 0.6;
  sphere[1].colour = vec3(0.3,0.8,0.3);
  sphere[2].centre   = vec3(1.0, 0.7, -2.2);
  sphere[2].radius   = 0.8;
  sphere[2].colour = vec3(0.3,0.8,0.8);
  sphere[3].centre   = vec3(0.7, -0.3, -1.2);
  sphere[3].radius   = 0.2;
  sphere[3].colour = vec3(0.8,0.8,0.3);
  sphere[4].centre   = vec3(-0.7, -0.3, -1.2);
  sphere[4].radius   = 0.2;
  sphere[4].colour = vec3(0.8,0.3,0.3);
  sphere[5].centre   = vec3(0.2, -0.2, -1.2);
  sphere[5].radius   = 0.3;
  sphere[5].colour = vec3(0.8,0.3,0.8);
  plane.point = vec3(0,-0.5, 0);
  plane.normal = vec3(0, 1.0, 0);
  plane.colour = vec3(1, 1, 1);
  seed = int(mod(dir.x * dir.y * 39786038.0, 65536.0));

  //scene definition end

  //mat4 viewModel = inverse(modelViewMatrix);
  //vec3 cam = viewModel[3].xyz / viewModel[3].w;
  Ray ray;
  ray.origin = origin;
  ray.dir = normalize((modelViewMatrix * vec4(dir, 0)).xyz);

  float epsillon = 0.0001;

  // Frag color is initially black

  vec3 totColour = vec3(0, 0, 0);
  Intersection inter;
  inter.colour = vec3(0, 0, 0);
  inter.t = -1;
  int depth = 0;
  float k_r = 0.5;
  while (depth < raytraceDepth) {
    Intersect(ray, inter);
    if (inter.t != -1) {
      totColour += pow(k_r, depth) * computeShadow(inter);
      depth++;

      Ray reflectedRay;
      reflectedRay.origin = inter.point;
      reflectedRay.dir = normalize(
        ray.dir - dot(2 * ray.dir, inter.normal) * inter.normal);
      reflectedRay.origin += reflectedRay.dir * epsillon;

      inter.colour = vec3(0, 0, 0);
      inter.t = -1;
      ray = reflectedRay;
    } else {
      break;
    }
  }

  if (depth == 0) {
    depth++;
  }

  outcolour = vec4(totColour, 1);
}
