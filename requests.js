load("util.js")

GetProductPrice = function(prod, clientType, date){
  prix = fetchobj(db.getCollection("Prix").aggregate([
    {
      $match: {
        "Client" : clientType,
        "Vetement" : prod,
        "Start_date" : {$lte : date}
      }
    },
    { $sort: {"Start_date" : -1} },
    { $limit: 1 }
  ]))[0].Prix

  vetType = db.getCollection("Vetements").findOne({"_id" : prod}).Type

  red = db.getCollection("Reductions").findOne({
    "Client" : clientType,
    "Vetement" : vetType,
    "Start_date" : {$lte : date},
    "End_date" : {$gte : date}
  })

  if(red) prix *= red.Pourcentage
  return prix
}

print(`\nPrice of item #70 for a new client today:`, GetProductPrice(70, "Nouvel", new Date()))

GetVenteSum = function(venteId){
  vente = db.getCollection("Ventes").findOne({"_id" : venteId})
  clientType = db.getCollection("Clients").findOne({"_id" : vente.Client}).Type
  res = Object.keys(vente.Liste_Vente)
          .map(vetementId => vente.Liste_Vente[vetementId] * GetProductPrice(Number(vetementId), clientType, vente.Date))
          .reduce((a, b) => a + b, 0)
  return res
}

print(`\nTotal for receipt #1:`, GetVenteSum(1))

// Calcule de stock total et ventes total

mapFunctionStock = function(){
  Object.keys(this.Stock).forEach(vetementId => emit(vetementId, this.Stock[vetementId]))
}

mapFunctionVentes = function(){
  Object.keys(this.Liste_Vente).forEach(vetementId => emit(vetementId, this.Liste_Vente[vetementId]))
}

reduceFunction = function(key, values){
  return Array.sum(values)
}

print("\nTotal stock:")
print(
  fetchMRobj(
    db
    .getCollection("Entrepots")
    .mapReduce(mapFunctionStock, reduceFunction, { out: {inline : 1} })
  )
  .map(({_id, value}) => `Product code ${_id} : ${value} items in stock`)
  .join("\n")
)

print("\nTotal sales:")
print(
  fetchMRobj(
    db
    .getCollection("Ventes")
    .mapReduce(mapFunctionVentes, reduceFunction, { out: {inline : 1} })
  )
  .map(({_id, value}) => `Product code ${_id} : ${value} items sold`)
  .join("\n")
)

