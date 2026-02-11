import { BufferGeometry, Float32BufferAttribute } from "three";

import { merge as flatten } from "d3-array";
import * as earcut from "earcut";
import geoPolygonTriangulate from "./GeneratePolygonPoints";

export const GenerateCountryPolygon = (
  polygonGeoJson: any,
  curvatureResolution: number = 5,
  radius: number
) => {
  // pre-calculate contour, triangulation and UV maps
  const { contour, triangles } = geoPolygonTriangulate(polygonGeoJson, {
    resolution: curvatureResolution,
  });
  const flatUvs = flatten(triangles.uvs);

  const bufferGeometry = new BufferGeometry();

  let vertices = [];
  let uvs = [];
  let indices = [];
  let groupCnt = 0; // add groups to apply different materials to torso / caps

  const addGroup = (groupData) => {
    const prevVertCnt = Math.round(vertices.length / 3);
    const prevIndCnt = indices.length;

    vertices = vertices.concat(groupData.vertices);
    uvs = uvs.concat(groupData.uvs);
    indices = indices.concat(
      !prevVertCnt
        ? groupData.indices
        : groupData.indices.map((ind) => ind + prevVertCnt)
    );

    bufferGeometry.addGroup(
      prevIndCnt,
      indices.length - prevIndCnt,
      groupCnt++
    );
  };

  addGroup(generateCap());

  // build geometry
  bufferGeometry.setIndex(indices);
  bufferGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(vertices, 3)
  );
  bufferGeometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));

  // auto-calculate normals
  bufferGeometry.computeVertexNormals();

  function generateVertices(polygon) {
    const coords3d = polygon.map((coords) =>
      coords.map((point) => convertCartesian(point, radius))
    );
    // returns { vertices, holes, coordinates }. Each point generates 3 vertice items (x,y,z).
    return earcut.flatten(coords3d);
  }

  function generateCap() {
    return {
      indices: triangles.indices,
      vertices: generateVertices([triangles.points]).vertices,
      uvs: flatUvs,
    };
  }

  function polar2Cartesian(lat, lng) {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((90 - lng) * Math.PI) / 180;
    return [
      radius * Math.sin(phi) * Math.cos(theta), // x
      radius * Math.cos(phi), // y
      radius * Math.sin(phi) * Math.sin(theta), // z
    ];
  }

  return { bufferGeometry, contour, triangles };
};

export const convertCartesian = (point, radius) => {
  const lambda = (point[0] * Math.PI) / 180;
  const phi = (point[1] * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  return [
    radius * cosPhi * Math.cos(lambda),
    radius * Math.sin(phi),
    -radius * cosPhi * Math.sin(lambda),
  ];
};

export const convertCartesianPointArray = (points, radius) => {  
  const polarPoints = points.map((polygon) =>
    polygon.map((point) => {
      return convertCartesian(point, radius);
    })
  );
  
  return polarPoints;
};
