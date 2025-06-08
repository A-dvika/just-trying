@echo off
rem --- Run your two environment-setup scripts ---
rem The CALL keyword makes sure any environment variables they set
rem stay in the current CMD session.

call "I:\sw\ficc\shell\cmd\trainenv.cmd"
call "H:\all_language.cmd"

rem ---- Optional: define a handy alias so you can re-run them later ----
doskey setupenv=call "I:\sw\ficc\shell\cmd\trainenv.cmd" $T call "H:\all_language.cmd"

echo.
echo [✓] Environment initialised – ready to work!
