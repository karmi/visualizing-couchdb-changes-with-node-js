#!/bin/bash

for i in {1..5}
  do
    curl -s -H 'Content-Type: application/json' -X POST http://localhost:5984/test -d '{"foo":"bar"}'
  done
