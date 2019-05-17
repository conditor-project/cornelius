# Cornelius
Cornelius is a GUI for [Conditor API](https://github.com/conditor-project/api) for nearDuplicates human-validation.

A demo version is available at : [https://conditor-project.github.io/cornelius/](https://conditor-project.github.io/cornelius/)

# :construction_worker: Work in progress :construction:


## Config

Cornelius can be configured with some options via environment variables
  - `CONDITORAPI_URL` : URL of Conditor API (e.g. https://api.conditor.fr/v1)
  - `CORNELIUS_PAGESIZE` : Number of records to display on a page results.
  - `LOG_PATH` : Path to log directory

## Install

Once you have exported environment variables :

```bash
git clone https://github.com/conditor-project/cornelius.git
cd cornelius
npm install && npm run build # only needed if you want to overload default configuration
make run-prod
```
