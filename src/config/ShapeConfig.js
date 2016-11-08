/**
 * Created by oye on 16/10/8.
 */

var ShapeConfig = function () {
    this.id = 0;
    this.type = 0;
    this.name = "";
    this.verts = [];
    this.radius = 0;
};

ShapeConfig.prototype.unmarshal = function (jsonObj) {
    this.id = jsonObj["id"];
    this.type = jsonObj["type"];
    this.name = jsonObj["name"];
    var verts = jsonObj["verts"] || [];
    for (var i = 0; i < verts.length; ++i) {
        var vertList = verts[i];
        var resultList = [
            vertList[0],
            vertList[1],
            vertList[0],
            vertList[3],
            vertList[2],
            vertList[3],
            vertList[2],
            vertList[1]
        ];
        this.verts.push(resultList);
    }
    this.radius = jsonObj["radius"] || 0;
};

ShapeConfig.prototype.getMaxWidth = function () {
    var maxWidth = 0;
    for (var i = 0; i < this.verts.length; ++i) {
        var vertList = this.verts[i];
        for (var j = 0; j < vertList.length; ++j) {
            if (vertList[j] > maxWidth) {
                maxWidth = vertList[j];
            }
        }
    }
    return maxWidth;
};