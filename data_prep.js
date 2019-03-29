load("util.js")

//generalize this and use for all
imbricate = function(parent, parent_field, child, child_field) {
  if (fetchobj(db.getCollection(child).find({})).length > 0) {
    print(`Imbricating ${child} into ${parent}`)
    fetchobj(db.getCollection(parent).find({}))
      .map(x => x._id)
      .forEach(id => {
        mats = fetchobj(db.getCollection(child).find(
          {[parent_field]: id},
          {[parent_field]: 0}
        ))

        db.getCollection(parent).update(
          {"_id": id},
          {$set: {[child_field]: mats}}
        )
      })

    db.getCollection(child).drop()
  }
}

compose = function(parent, parent_field, child, child_field, child_value) {
  if (fetchobj(db.getCollection(child).find({})).length > 0) {
    print(`Imbricating ${child} into ${parent} as composition`)
    fetchobj(db.getCollection(parent).find({}))
    .map(x => x._id)
    .forEach(id => {
      comps = fetchobj(db.getCollection(child).find(
        {[parent_field] : id},
        {[parent_field] : 0}
      ))
      res = {}
      comps.forEach(comp =>{
        res[comp[child_field]] = comp[child_value]
      })
      db.getCollection(parent).update(
        {"_id": id},
        {$set: {[child]: res}}
      )
    })

    db.getCollection(child).drop()
  }
}

datify = function(collection, field){
  print(`Correcting dates for ${collection}`)
  db.getCollection(collection).find({[field]: {$exists: true, $type: 2}}).forEach(x => { 
    x[field] = new Date(x[field].substring(0,10));
    db.getCollection(collection).save(x);
  })
}

typify = function(parent_dict, typecol, typecol_fld) {
  if (fetchobj(db.getCollection(typecol).find({})).length > 0) {
    for ([collection, typefld] of parent_dict){
      print(`Moving types from ${typecol} to ${collection}`)
      db.getCollection(collection).find({}).forEach(x => {
        typeval = db.getCollection(typecol).findOne(
          {"_id": x[typefld]}
        )[typecol_fld]
        db.getCollection(collection).update(
          {"_id": x._id},
          {
            $set: {[typefld]: typeval}
          }
        )
      })
    }

    db.getCollection(typecol).drop()
  }
}

imbricate("Fournisseurs", "Fournisseur", "Materiaux",   "Materiaux")

compose("Vetements", "Vetements", "Composition", "Materiel", "Quantite")
compose("Entrepots", "Entrepot",  "Stock",       "Vetement", "Quantite")
compose("Ventes",    "Vente",     "Liste_Vente", "Vetement", "Quantite")

datify("Paiements",  "Date")
datify("Prix",       "Start_date")
datify("Prix",       "Creation_date")
datify("Reductions", "Start_date")
datify("Reductions", "End_date")
datify("Ventes",     "Date")

typify(
  [
    ["Vetements", "Type"],
    ["Reductions", "Vetement"]
  ], 
  "Vetement_Types", 
  "Nom"
)
typify(
  [
    ["Clients",    "Type"],
    ["Reductions", "Client"],
    ["Prix",       "Client"]
  ], 
  "Client_Type",    
  "Nom"
)