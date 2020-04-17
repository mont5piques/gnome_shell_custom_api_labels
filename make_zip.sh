#!/bin/bash

extname="custom-api-labels@nytrio.com"

[ -f "${extname}.zip" ] && rm -f "${extname}.zip"

pushd "${extname}"
  zip -r ../"${extname}.zip" *
popd
