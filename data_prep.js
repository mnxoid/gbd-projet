load("util.js")

//generalize this and use for all
function imbricate(parent, parent_field, child, child_field) {
	if (fetchobj(db.getCollection(child).find({})).length > 0) {
		print(`\n${child} et ${parent} fusion`)
		fetchobj(db.getCollection(parent).find({}))
			.map(x=>x._id)
			.forEach(id => {
				print("Processing id: " + id)
				mats = fetchobj(db.getCollection(child).find(
					{[parent_field]: id},
					{ 
						[parent_field]: 0
					} 
				))

				db.getCollection(parent).update(
					{"_id": id},
					{
						$set: {
							[child_field]: mats
						}
					}
				)
			})

		db.getCollection(child).drop()

		print(fetch(db.getCollection(parent).find({})))
	}
}

imbricate("Fournisseurs", "Fournisseur", "Materiaux", "Materiaux")
imbricate("Entrepots", "Entrepot", "Stock", "Stock")