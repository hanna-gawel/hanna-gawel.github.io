#!/bin/bash

echo "Downloadign google scholar"
wget -O scholar.bib $1
echo "Covnerting"
pandoc scholar.bib --citeproc --csl nature.csl -t plain --wrap=none -o biblio.txt && rm scholar.bib
