#!/bin/bash

echo -e "\n\e[1mInserting 500 documents into http://localhost:5984/test. Stop me with Ctrl+C.\e[0m\n\n"

for i in {1..5000}
  do
    curl -s -H 'Content-Type: application/json' -X POST http://localhost:5984/test -d '{"foo":"bar"}'
  done
