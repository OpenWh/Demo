function PyramidBufferGeometry(proportion, angle, height) {

    BufferGeometry.call(this);

    this.type = 'PyramidBufferGeometry';

    this.parameters = {
        proportion: proportion,
        angle, angle,
        height: height,
    };

    if (proportion === 1 && proportion === undefined && proportion > 0
        && angle === undefined && angle > 0
        && isNaN(proportion) && isNaN(angle))
        return;

    var radialSegments = 4;
    var heightSegments = 1;
    var radian = (Math.PI * 2 / 360) * angle / 2;//求弧度
    var longedgehalf;//长边一半
    var shortedgehalf;//短边一半
    var beveledgehalf;//斜边一半
    var edge1;
    var changeXedge;//X轴变化坐标
    var changeZedge;//Y轴变化坐标

    calculateAddXAndZ();
    var scope = this;
    height = height !== undefined ? height : 100;

    var thetaStart = 0;
    var thetaLength = 2.0 * Math.PI;

    // used to calculate buffer length
    var vertexCount = 10;
    var indexCount = 24;

    // buffers
    var indices = new BufferAttribute(new (indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount), 1);
    var vertices = new BufferAttribute(new Float32Array(vertexCount * 3), 3);
    var normals = new BufferAttribute(new Float32Array(vertexCount * 3), 3);
    var uvs = new BufferAttribute(new Float32Array(vertexCount * 2), 2);

    // helper variables
    var index = 0,
        indexOffset = 0,
        indexArray = [],
        halfHeight = height / 2;

    // group variables
    var groupStart = 0;

    // generate geometry

    generateTorso();

    // build geometry

    this.setIndex(indices);
    this.addAttribute('position', vertices);
    this.addAttribute('normal', normals);
    this.addAttribute('uv', uvs);

    function generateTorso() {
        var x, y;
        var normal = new Vector3();
        var vertex = new Vector3();

        var groupCount = 0;

        // generate vertices, normals and uvs

        for (y = 0; y <= heightSegments; y++) {

            var indexRow = [];

            var v = y / heightSegments;

            // calculate the radius of the current row
            var radiusBottom;
            var slope;

            if (proportion > 1) {
                radiusBottom = Math.sqrt(Math.pow(shortedgehalf, 2) + Math.pow(shortedgehalf, 2));
                slope = radiusBottom / height;
            }
            else {
                radiusBottom = Math.sqrt(Math.pow(longedgehalf, 2) + Math.pow(longedgehalf, 2));
                slope = radiusBottom / height;
            }
            var radius = v * radiusBottom;

            for (x = 0; x <= radialSegments; x++) {
                var u = x / radialSegments;
                var theta = u * thetaLength + thetaStart;

                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

                if (proportion > 1) {
                    // vertex
                    vertex.x = radius * sinTheta;
                    vertex.y = -v * height + halfHeight;
                    vertex.z = radius * cosTheta;
                    if (radius > 0) {
                        if (x > 1 && x !== 4) {
                            vertex.x += changeXedge * ((x + 1) % 2 === 1 ? 1 : -1);
                            vertex.z += changeZedge * ((x + 1) % 2 === 1 ? -1 : 1);
                        }
                        else {
                            vertex.x += changeXedge * ((x + 1) % 2 === 1 ? -1 : 1);
                            vertex.z += changeZedge * ((x + 1) % 2 === 1 ? 1 : -1);
                        }
                    }
                    vertices.setXYZ(index, vertex.x, vertex.y, vertex.z);
                } else {
                    vertex.x = radius * sinTheta;
                    vertex.y = -v * height + halfHeight;
                    vertex.z = radius * cosTheta;
                    if (radius > 0) {
                        if (x > 1 && x !== 4) {
                            vertex.x += changeXedge * ((x + 1) % 2 === 1 ? 1 : -1);
                            vertex.z += changeZedge * ((x + 1) % 2 === 1 ? -1 : 1);
                        }
                        else {
                            vertex.x += changeXedge * ((x + 1) % 2 === 1 ? -1 : 1);
                            vertex.z += changeZedge * ((x + 1) % 2 === 1 ? 1 : -1);
                        }
                    }
                    vertices.setXYZ(index, vertex.x, vertex.y, vertex.z);
                }

                // normal
                normal.set(sinTheta, slope, cosTheta).normalize();
                normals.setXYZ(index, normal.x, normal.y, normal.z);

                // uv
                uvs.setXY(index, u, 1 - v);

                // save index of vertex in respective row
                indexRow.push(index);

                // increase index
                index++;

            }

            // now save vertices of the row in our index array
            indexArray.push(indexRow);

        }

        // generate indices

        for (x = 0; x < radialSegments; x++) {

            for (y = 0; y < heightSegments; y++) {

                // we use the index array to access the correct indices
                var i1 = indexArray[y][x];
                var i2 = indexArray[y + 1][x];
                var i3 = indexArray[y + 1][x + 1];
                var i4 = indexArray[y][x + 1];

                // face one
                indices.setX(indexOffset, i1); indexOffset++;
                indices.setX(indexOffset, i2); indexOffset++;
                indices.setX(indexOffset, i4); indexOffset++;

                // face two
                indices.setX(indexOffset, i2); indexOffset++;
                indices.setX(indexOffset, i3); indexOffset++;
                indices.setX(indexOffset, i4); indexOffset++;

                // update counters
                groupCount += 6;

            }

        }

        // add a group to the geometry. this will ensure multi material support
        scope.addGroup(groupStart, groupCount, 0);

        // calculate new start value for groups
        groupStart += groupCount;

    }

    function calculateAddXAndZ() {
        if (proportion > 1) {
            longedgehalf = Math.tan(radian) * height;
            shortedgehalf = longedgehalf * (1 / proportion);
        }
        else {
            shortedgehalf = Math.tan(radian) * height;
            longedgehalf = shortedgehalf * (1 / proportion);
        }

        beveledgehalf = Math.sqrt(Math.pow(longedgehalf, 2) + Math.pow(shortedgehalf, 2));

        var radian1 = Math.asin(2 * (shortedgehalf / beveledgehalf) * (longedgehalf / beveledgehalf));
        var radian2 = (radian1 - Math.PI / 2) / 2;
        var radian3 = radian1 / 2 - radian2;

        if (proportion > 1) {
            edge1 = shortedgehalf;
        }
        else {
            edge1 = longedgehalf;
        }

        changeZedge = changeXedge = Math.abs(beveledgehalf * Math.sin(radian2));
    }
}

PyramidBufferGeometry.prototype = Object.create(BufferGeometry.prototype);
PyramidBufferGeometry.prototype.constructor = PyramidBufferGeometry;