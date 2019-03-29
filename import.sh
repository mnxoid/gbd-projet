mongo ProjectDB --eval "db.dropDatabase()"

for f in $(ls json/*.json);
do
  mongoimport -d ProjectDB --jsonArray $f
done 