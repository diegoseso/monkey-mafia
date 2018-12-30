#! /bin/bash

sips -s format png -s formatOptions 80 "${1}" --out "${2}"
