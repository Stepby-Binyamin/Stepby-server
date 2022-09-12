const { toXML } = require("jstoxml");


function getXML(object) {
  return toXML(object, {
    indent: "    ",
    header: true,
  });
}

const xmlHeaders = {
  "Content-Type": "application/xml",
};

module.exports = {
  getXML,
  xmlHeaders,
};