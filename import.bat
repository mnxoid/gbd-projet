@echo off

mongo ProjectDB --eval "db.dropDatabase()"

for %%f in (json\*.json) do (
	mongoimport /d ProjectDB --jsonArray %%f
) 
