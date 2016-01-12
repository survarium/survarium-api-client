# Survarium-api-client  [![Build Status](https://travis-ci.org/survarium/survarium-api-client.svg?branch=master)](https://travis-ci.org/survarium/survarium-api-client)

API client for [Survarium game](http://survarium.com).  
This is a port of initial [PHP-client](https://github.com/PhpSurvarium/SurvariumAPI).

## Docs
[API handlers](http://survarium.github.io/survarium-api-client/docs/Api.html)

## Requirements
* `nodejs >= 4`

## Install
Import it into your project via package.json `dependencies`

`"survarium-api-client": "git+https://github.com/survarium/survarium-api-client.git"`

## Usage

[See example](https://github.com/survarium/survarium-api-client/blob/master/example/v0.js)


## Configuration
Environment variables are
* DEBUG – show debug messages (`survarium-api-client`) [default=false]
* `SV_API_RETRIES` – amount of retries in case of network or api error [default=10]
* `SV_API_DELAY_MIN` – min delay for api request [delay mode] and base number for retry pause [default=20]
* `SV_API_DELAY_MAX` – max delay for api request [delay mode] and incremental base for retry pause [default=200] 
* `SV_API_DELAY_MODE` – enable quering in delay mode (requests delayed before starts, possible parallel requests) [default=false]
* `SV_API_STACK_MODE` – enable quering in stack mode (each request may be runned only after previous been resolved) [default=false]
* `SV_API_STACK_PAUSE` – pause before starting new request after previous ends, ms [default=20]
* `SV_API_SAVE_SOURCE` – save RAW JSON response to target directory (trailing slash required)[default=false]
