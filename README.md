# Pinball Wizard

## Setup:

## Install [sqlite3](www.sqlite.org) v >= `3.6.19`

On macOS:
```
$ brew install sqlite3
```

Ubuntu or Mint:

check version

```
$ sqlite3 --version
```
if at or above `3.6.19`: you are good

else:  ¯\\_(ツ)_/¯

## Install [nvm](https://github.com/creationix/nvm)

## Install packages

```
$ nvm use
$ npm install -g typescript@2 webpack@2 webpack-dev-server@2
$ npm install
```

## Run tests

```
$ npm run test
```

## Create database

```
$ npm run create:database
```

## Start server

```
$ npm run start
```

