# [2.0.0](https://github.com/DanielHabenicht/MMM-json/compare/v1.1.4...v2.0.0) (2022-01-09)


### Bug Fixes

* Rename Notifications ([869e182](https://github.com/DanielHabenicht/MMM-json/commit/869e1828f886e0a0e87f54eb726d84a4a4b62ba8))
* use node-fetch instead of request ([75cd82f](https://github.com/DanielHabenicht/MMM-json/commit/75cd82f314dfc6601e51ad81ae3af8aee949f63e)), closes [#7](https://github.com/DanielHabenicht/MMM-json/issues/7)


### BREAKING CHANGES

* use `fetchOptions` instead of `request` in you config
* rename notifications

to better resemble that they could also be POST or other requests.

MMM_JSON_GET_REQUEST > MMM_JSON_REQUEST
MMM_JSON_GET_RESPONSE > MMM_JSON_RESPONSE

## [1.1.4](https://github.com/DanielHabenicht/MMM-json/compare/v1.1.3...v1.1.4) (2022-01-09)


### Bug Fixes

* **release:** fix releaserc ([1e79db4](https://github.com/DanielHabenicht/MMM-json/commit/1e79db40581f5cee33f1902443e62419a948510e))

# 1.0.0 (2021-03-03)


### Bug Fixes

* **header:** show builtin header ([b23d011](https://github.com/DanielHabenicht/MMM-json/commit/b23d011914edfcd43d472f8377b79b38283c353c)), closes [#1](https://github.com/DanielHabenicht/MMM-json/issues/1)
