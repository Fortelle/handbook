@echo off

set /p "msg=Commit:" || set "msg=update"

git add --a
git commit -m "%msg%"
git push

pause