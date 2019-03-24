@echo off

for %%f in (json\*.json) do (
	mongoimport /d ProjectDB --jsonArray %%f
) 
