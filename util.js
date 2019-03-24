// Polyfills
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength,padString) {
    targetLength = targetLength>>0; //floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (this.length > targetLength) {
      return String(this);
    }
    else {
      targetLength = targetLength-this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0,targetLength);
    }
  };
}

//------------------------------------------------------------------------------
// Connection
conn = new Mongo();
db = conn.getDB("ProjectDB")
// Declarations
fetch = x => tojson(x.toArray())
// fetchobj = x => JSON.parse(tojson(x.toArray()))
fetchobj = x => x.toArray()
fetchMR = x => tojson(x.results)
fetchMRobj = x => x.results
display = x => print(fetch(x))